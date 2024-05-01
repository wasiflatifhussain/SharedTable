import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type Props = {
    onCheckout: (userFormData: UserFormData) => void;
    disabled: boolean;
    isLoading: boolean;
}

const CheckoutButton = ({ onCheckout, disabled, isLoading: isCheckoutLoading }: Props) => {
    const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
    
    const { pathname } = useLocation();

    const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

    const onLogin = async () => {
        await loginWithRedirect({
          appState: {
            returnTo: pathname,
          },
        });
      };

    if (!isAuthenticated) {
        return (
        //   <Button onClick={onLogin} className="bg-[#048A52] flex-1">
        //     Log in to check out
        //   </Button>
        //   <Button onClick={async () => await loginWithRedirect({
        //     appState: {
        //       returnTo: pathname,
        //     },
        //   })} className="bg-[#048A52] flex-1">
        //     Log in to check out
        //   </Button>
          <Button onClick={async () => await loginWithRedirect({})} className="bg-[#048A52] flex-1">
            Log in to check out
          </Button>
        );
      }

    if (isAuthLoading || !currentUser || isCheckoutLoading) {
        return (<LoadingButton />) 
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#048A52] flex-1" disabled={disabled}>
                    Go to checkout
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px]s md:min-w-[900px] md:min-h-[500px] bg-gray-50 p-10">
                <UserProfileForm currentUser={currentUser} onSave={onCheckout} isLoading={isGetUserLoading} title="Confirm Delivery Details" buttonText="Continue to payment" />
            </DialogContent>
        </Dialog>
    )
    
};

export default CheckoutButton;