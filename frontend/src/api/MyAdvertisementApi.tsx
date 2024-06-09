import { UserAdvertisements } from "@/types"; // Ensure this path is correct
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateAdvertisement = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createAdvertisementRequest = async (advertisementFormData: FormData): Promise<UserAdvertisements> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/advertisements/add-advertisements`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: advertisementFormData,
        });
        if (!response.ok) {
            throw new Error("Failed to create advertisement.");
        }
        return response.json();
    };

    const { mutate: createAdvertisement, isLoading, isSuccess, error } = useMutation(createAdvertisementRequest, {
        onSuccess: () => {
            toast.success("Advertisement created!");
        },
        onError: () => {
            toast.error("Failed to create advertisement.");
        },
    });

    return { createAdvertisement, isLoading, isSuccess, error };
};

