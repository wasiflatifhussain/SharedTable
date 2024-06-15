import { UserAdvertisements } from "@/types"; // Ensure this path is correct
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
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
        onSuccess: (data) => {
            // Redirect the user to Stripe Checkout or handle the success case:
            window.location.href = data.url;
            toast.success("Advertisement created.")
        },
        onError: (error) => {
            // Handle errors:
            toast.error(`Error: Failed to create advertisement.`);
        },
    });

    return { createAdvertisement, isLoading, isSuccess, error };
};

const renewAdvertisementPlan = async ({ advertisementId, accessToken }) => {
    const response = await fetch(`${API_BASE_URL}/api/advertisements/renew-advertisements`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adId: advertisementId }), // Make sure this matches the backend expectation
    });

    if (!response.ok) {
        throw new Error("Failed to renew advertisement.");
    }
    return response.json();
};

export const useRenewAdvertisementPlan = () => {
    const { getAccessTokenSilently } = useAuth0();

    const mutation = useMutation(async (advertisementId: string) => {
        const accessToken = await getAccessTokenSilently();
        return renewAdvertisementPlan({ advertisementId, accessToken });
    }, {
        onSuccess: (data) => {
            // Handle the success case
            window.location.href = data.url;
            toast.success("Advertisement renewed.");
        },
        onError: (error) => {
            // Handle errors
            toast.error(`Error: Failed to renew advertisement.`);
        },
    });

    return mutation;
};


const fetchRandomAdvertisement = async (email) => {
    console.log("email = ",email);
    const response = await fetch(`${API_BASE_URL}/api/advertisements/random-advertisement?email=${email}`);
    if (!response.ok) {
        throw new Error("Failed to fetch advertisement.");
    }
    return response.json();
};

export const useFetchAdvertisement = () => {
    const { user, isAuthenticated } = useAuth0();
    const [showModal, setShowModal] = useState(false);

    const { data, error, isLoading } = useQuery(
        ["randomAdvertisement", user ? user.email : ''],
        () => fetchRandomAdvertisement(user.email),
        {
            enabled: !!user,  // Only run the query if the user object is defined
            onSuccess: () => {
                // Delay showing the modal by 5 seconds
                setTimeout(() => {
                    setShowModal(true);
                }, 3000);
            }
        }
    );

    useEffect(() => {
        if (error) {
            toast.error(`Error: ${error.message}`);
        }
    }, [error]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return { data, showModal, handleCloseModal, isLoading, error };
};
