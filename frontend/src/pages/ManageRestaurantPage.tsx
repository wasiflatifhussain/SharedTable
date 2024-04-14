import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
    const { createRestaurant, isLoading: isCreateLoading }  = useCreateMyRestaurant();
    const { restaurant } = useGetMyRestaurant();
    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();

    const isEditing = !!restaurant;  // !! = give the truth value for restaurant; answer is Bool

    return (
        <ManageRestaurantForm 
            onSave={isEditing? updateRestaurant : createRestaurant} 
            isLoading={isCreateLoading || isUpdateLoading} 
            restaurant={restaurant} />
    )
};

export default ManageRestaurantPage;