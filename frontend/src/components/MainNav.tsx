import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";
import { Link } from "react-router-dom";

const MainNav = () => {
    const {loginWithRedirect, isAuthenticated} = useAuth0();
    return (
        <span className="flex space-x-2 items-center">
            {isAuthenticated? (
                <>
                    <Link to="/donate-support" className="font-bold hover:text-[#048a52]" style={{marginRight: "20px"}}>
                        Donate to Support
                    </Link>
                    <Link to="/order-status" className="font-bold hover:text-[#048a52]">
                        Order Staus
                    </Link>
                    <UsernameMenu />
                </>
                
            ) : (
                <Button variant="ghost" 
                        className="font-bold hover:text-[#048a52] hover:bg-white"
                        onClick={async () => await loginWithRedirect()}>
                    Log In
                </Button>
                ) 
            }
        </span>
    )
}
  
export default MainNav;