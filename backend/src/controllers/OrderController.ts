import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurants";
import Order from "../models/order";
import Donations from "../models/donations";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({user: req.userId})
            .populate("restaurant")
            .populate("user");
        
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
};

type CheckoutSessionRequest = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        area: string;
    };
    restaurantId: string;
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
    let event;

    try {
        const sig = req.headers["stripe-signature"];
        event = STRIPE.webhooks.constructEvent(
            req.body, 
            sig as string, 
            STRIPE_ENDPOINT_SECRET);

    } catch (error: any) {
        console.log(error);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const order = await Order.findById(event.data.object.metadata?.orderId);

        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        order.totalAmount = event.data.object.amount_total;
        order.status = "paid";

        await order.save();
    }

    res.status(200).send();
}

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant not found!");
        }

        const newOrder = new Order({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        });

        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);

        const session = await createSession(
            lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString()
        );

        if (!session.url) {
            return res.status(500).json({ message: "Error creating stripe session!" });
        }

        await newOrder.save();
        res.json({ url: session.url });
    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.raw.message });
    }
}

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[]) => {
    // 1. for each cart item, get the menuItem object from the restaurant (to get price)
    // 2. for each cart item, convert it into a stripe line item
    // 3. return line item array

    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find(
            (item) => item._id.toString() === cartItem.menuItemId.toString()
        );

        if (!menuItem) {
            throw new Error(`Menu Item not found: ${cartItem.menuItemId}`);
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: "hkd",
                unit_amount: menuItem.price * 100,
                product_data: {
                    name: menuItem.name,
                },
            },
            quantity: parseInt(cartItem.quantity),
        };

        return line_item;
    });

    return lineItems;
}

const createSession = async (
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], orderId: string, deliveryPrice: number, restaurantId: string
) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice * 100,
                        currency: "hkd",
                    },
                },
            },
        ],
        mode: "payment",
        metadata: {
            orderId, 
            restaurantId,
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`
    });

    return sessionData;
};


export const getDeliveredOrdersCount = async (req: Request, res: Response) => {
    try {
        // Retrieve delivered counts for each restaurant
        const deliveredCounts = await Order.aggregate([
            { $match: { status: "delivered" } },
            {
                $group: {
                    _id: "$restaurant",
                    deliveredCount: { $sum: 1 }
                }
            }
        ]);

        // Retrieve all donations
        const allDonations = await Donations.find();

        // Create a dictionary to store donations by restaurant ID
        const donationsByRestaurant: Record<string, number> = {};
        allDonations.forEach((donation) => {
            donationsByRestaurant[donation.restaurantID] = donation.totalDonation;
        });

        // Initialize deliveredCountsByRestaurant object
        const deliveredCountsByRestaurant: Record<string, { restaurantID: string; deliveredCount: number; imageUrl: string; totalDonation: number }> = {};

        // Populate delivered counts and donation information for each restaurant
        for (const item of deliveredCounts) {
            const restaurant = await Restaurant.findById(item._id);
            if (restaurant) {
                const restaurantID = item._id.toString();
                deliveredCountsByRestaurant[restaurant.restaurantName] = {
                    restaurantID,
                    deliveredCount: item.deliveredCount,
                    imageUrl: restaurant.imageUrl,
                    totalDonation: donationsByRestaurant[restaurantID] || 0 // Default to 0 if no donation found
                };
            }
        }

        // Get all restaurants from the restaurant collection
        const allRestaurants = await Restaurant.find();

        // Populate delivered counts and donation information for restaurants without delivered orders
        allRestaurants.forEach((restaurant) => {
            const restaurantName = restaurant.restaurantName;
            if (!deliveredCountsByRestaurant[restaurantName]) {
                const restaurantID = restaurant._id.toString();
                deliveredCountsByRestaurant[restaurantName] = {
                    restaurantID,
                    deliveredCount: 0,
                    imageUrl: restaurant.imageUrl,
                    totalDonation: donationsByRestaurant[restaurantID] || 0 // Default to 0 if no donation found
                };
            }
        });

        res.json(deliveredCountsByRestaurant);
    } catch (error) {
        console.error("Failed to fetch delivered orders count", error);
        res.status(500).json({ message: "Failed to fetch delivered orders count" });
    }
};


export default {
    getMyOrders,
    createCheckoutSession,
    stripeWebhookHandler,
    getDeliveredOrdersCount,
}