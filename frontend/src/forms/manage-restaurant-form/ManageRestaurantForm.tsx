import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
    restaurantName: z.string({
        required_error: "Restaurant name is required",
    }),
    city: z.string({
        required_error: "City name is required",
    }),
    country: z.string({
        required_error: "Country name is required",
    }),
    deliveryPrice: z.coerce.number({
        required_error: "Delivery Price is required",
        invalid_type_error: "Must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
        required_error: "Estimated delivery Time is required",
        invalid_type_error: "Must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({
        message: "Please select at least one item",
    }),
    menuItems: z.array(z.object({
        name: z.string().min(1, "[Name is required]"),
        price: z.coerce.number().min(1, "[Price is required]"),
    })),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, {message: "Image is required"}).optional(),
}).refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
});

type RestaurantFormData = z.infer<typeof formSchema>

type Props = {
    onSave: (restaurantFormData: FormData) => void;
    isLoading: boolean;
    restaurant?: Restaurant;
};

const ManageRestaurantForm = ({onSave, isLoading, restaurant}: Props) => {
    const form = useForm<RestaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cuisines: [],
            menuItems: [{name: "", price: 0}],
        },
    });

    useEffect(() => {
        if (!restaurant) {
            return;
        }
        const deliveryPriceFormatted = parseInt((restaurant.deliveryPrice/100).toFixed(2));
        const menuItemsFormatted = restaurant.menuItems.map((item) => ({
            ...item, 
            price: parseInt((item.price/100).toFixed(2)),
        }));
        const updatedRestaurant = {
            ...restaurant,
            deliveryPrice: deliveryPriceFormatted,
            menuItems: menuItemsFormatted,
        };
        form.reset(updatedRestaurant);
    }, [form, restaurant]);

    const onSubmit = (formDataJson: RestaurantFormData) => {
        const formData = new FormData();
        console.log(formDataJson)
        formData.append("restaurantName", formDataJson.restaurantName);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("deliveryPrice", (formDataJson.deliveryPrice * 100).toString());
        formData.append("estimatedDeliveryTime", formDataJson.estimatedDeliveryTime.toString());
        formDataJson.cuisines.forEach((cuisine,index) => {
            formData.append(`cuisines[${index}]`,cuisine)
        });
        formDataJson.menuItems.forEach((menuItem, index) => {
            formData.append(`menuItems[${index}][name]`, menuItem.name);
            formData.append(`menuItems[${index}][price]`, (menuItem.price * 100).toString());
        });

        if (formDataJson.imageFile) {
            formData.append(`imageFile`, formDataJson.imageFile);
        }

        console.log(formData);
        onSave(formData);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-[#fafef0] p-10 rounded-lg border-2 border-[#607523]">
                <DetailsSection />
                <Separator />
                <CuisinesSection />
                <Separator />
                <MenuSection />
                <Separator />
                <ImageSection />
                { isLoading ? 
                    <LoadingButton /> :
                    <Button type="submit" className="bg-[#607523]">
                        Submit
                    </Button>
                }
            </form>
        </Form>
    )
};
  
export default ManageRestaurantForm;