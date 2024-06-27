import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UsernameMenu from "./UsernameMenu";
import { Link } from "react-router-dom";
import "./Nav.css"

const MainNav = () => {
    const {loginWithRedirect, isAuthenticated} = useAuth0();
    return (
        <span className="flex space-x-2 items-center">
            {isAuthenticated? (
                <>
                    <Link to="/beta-test" className="font-bold hover:text-[#048a52] color-change" style={{marginRight: "20px", fontSize: "15px"}}>
                        Beta Release
                    </Link>
                    <Link to="/stories" className="font-bold hover:text-[#048a52]" style={{marginRight: "20px", fontSize: "15px"}}>
                        Our Stories
                    </Link>
                    <Link to="/advertisements" className="font-bold hover:text-[#048a52]" style={{marginRight: "20px", fontSize: "15px"}}>
                        Add/Manage Advertisements
                    </Link>
                    <Link to="/donate-support" className="font-bold hover:text-[#048a52]" style={{marginRight: "20px", fontSize: "15px"}}>
                        Donate to Support
                    </Link>
                    <Link to="/order-status" className="font-bold hover:text-[#048a52]" style={{fontSize: "15px"}}>
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