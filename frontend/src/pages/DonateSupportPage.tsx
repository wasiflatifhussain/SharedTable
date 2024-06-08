import { useCreateDonationSession, useDeliveredOrdersCount } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const DonateSupportPage = () => {
    const { deliveredOrdersCount, isLoading, isError, error, refetch } = useDeliveredOrdersCount();
    const [restaurantOrders, setRestaurantOrders] = useState<{ restaurantName: string; restaurantID: string; deliveredCount: number; imageUrl: string; totalDonation: number; }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const restaurantsPerPage = 8;
    const [amount, setAmount] = useState(50); // Example fixed amount or could be user input
    const [sharedtabledonation, setsharedtabledonation] = useState("");
    const { createDonationSession } = useCreateDonationSession();
    
    useEffect(() => {
        if (!isLoading && !isError && deliveredOrdersCount) {
            // Convert the object to an array of restaurant orders
            const ordersList = Object.entries(deliveredOrdersCount).map(([restaurantName, { restaurantID, deliveredCount, imageUrl, totalDonation, }]) => ({
                restaurantID,
                restaurantName,
                deliveredCount,
                imageUrl,
                totalDonation
            }));

            const sharedTableOrder = ordersList.find(order => order.restaurantID === "sharedtable");
            if (sharedTableOrder) {
                // Set the sharedtabledonation if sharedTableOrder exists
                setsharedtabledonation(sharedTableOrder.totalDonation);
            } else {
                // Set sharedtabledonation to an empty string if sharedTableOrder doesn't exist
                setsharedtabledonation("");
            }

            const filteredOrdersList = ordersList.filter(order => order.restaurantID !== "sharedtable");
            filteredOrdersList.sort((a, b) => b.deliveredCount - a.deliveredCount);
            console.log(filteredOrdersList)
            setRestaurantOrders(filteredOrdersList);
        }
    }, [deliveredOrdersCount, isLoading, isError, sharedtabledonation]);

    const handleDonate = async (restaurantId: string, restaurantName: string, elemid: string) => {
        console.log(restaurantId);
        const inputElement = document.getElementById(elemid);
        const amountToUse = parseInt((inputElement as HTMLInputElement).value) || 0;
        console.log(amountToUse)
        if (amountToUse < 4) {
            const errorElement = document.getElementById(restaurantId + "error");
            if (errorElement) {
                errorElement.style.display = "block";
                setTimeout(() => {
                    errorElement.style.display = "none";
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        } else {
            createDonationSession({ restaurantName, restaurantId, amount: amountToUse }).catch(console.error);
        }
    };

    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
    const currentRestaurants = restaurantOrders.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (isLoading) {
        return "Loading...";
    }

    if (isError || !restaurantOrders || restaurantOrders.length === 0) {
        return isError ? `Error: ${error?.message}` : "No orders found";
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Donation Page</h1>
            
            {/* Donation to SharedTable Section */}
            <div className="bg-green-100 bg-opacity-90 p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">Donation to SharedTable</h2>
                <p className="text-gray-700 mb-2">
                    Donate to us and help us continue connecting users with restaurants eager to join the cause of supporting sustainability, healthy-eating, and food-waste prevention!
                </p>
                <p className="text-gray-700 mb-5">
                    Total Donations: HKD {sharedtabledonation}
                </p>
                <div className="flex">
                    <input 
                        type="number" 
                        className="border border-gray-400 rounded-md px-3 py-1 mr-2 w-1/2" 
                        placeholder="Enter donation amount" 
                        id="sharedtabledonation"
                    />
                    <Button className="bg-[#048A52] hover:bg-green-500 text-white w-full py-3 rounded-md shadow-md" onClick={() => handleDonate("sharedtable", "SharedTable", "sharedtabledonation")}>
                        Donate Now
                    </Button>
                </div>
                <p className="text-red-600 mt-2 mb-2" style={{fontSize: "15px", display: "none"}} id={"sharedtableerror"}>Must enter a minimum value (greater than HKD 4) in order to donate.</p>
            </div>
            
            {/* Donation to Restaurants Section */}
            <div className="bg-green-100 bg-opacity-90 p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">Donation to Restaurants</h2>
                <h4 className="text-gray-800 mb-4">
                    Donate to your favourite restaurants and help them continue doing good deeds!
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                    {currentRestaurants.map((order, index) => (
                        <div key={index} className="bg-white shadow rounded-lg p-6 flex">
                            <div className="flex-shrink-0 mr-6">
                                <img src={order.imageUrl} alt={order.restaurantName} className="w-24 h-auto rounded-md" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-2">{order.restaurantName}</h2>
                                <p className="text-gray-600 mb-2">Delivered Orders: {order.deliveredCount}</p>
                                <p className="text-gray-600 mb-2">Total Donations: HKD {order.totalDonation}</p>
                                <div className="flex">
                                    <input 
                                        type="number" 
                                        className="border border-gray-400 rounded-md px-3 py-1 mr-2 w-1/2" 
                                        placeholder="Enter donation amount" 
                                        id={order.restaurantID+"donation"}
                                    />
                                    <Button className="bg-[#048A52] w-full" onClick={() => handleDonate(order.restaurantID, order.restaurantName,order.restaurantID+"donation")}>
                                        Donate to Support
                                    </Button>
                                </div>
                                <p className="text-red-600 mt-2 mb-2" style={{fontSize: "15px", display: "none"}} id={order.restaurantID+"error"}>Must enter a minimum value (greater than HKD 4) in order to donate.</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    {restaurantOrders.length > restaurantsPerPage && (
                        <ul className="flex">
                            {Array.from({ length: Math.ceil(restaurantOrders.length / restaurantsPerPage) }, (_, i) => (
                                <li key={i} className="mx-1">
                                    <button
                                        className={`px-4 py-2 bg-green-500 text-white rounded-md focus:outline-none ${currentPage === i + 1 ? 'bg-green-600' : ''}`}
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonateSupportPage;
