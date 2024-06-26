import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import "./Nav.css"

const MobileNavLinks = () => {
    const {logout} = useAuth0();
    return (
        <>
            <Link to="/beta-test" className="font-bold hover:text-[#048a52] color-change" style={{marginRight: "20px"}}>
                Beta Release
            </Link>
            <Link to="/advertisements" className="flex bg-white items-center font-bold hover:text-[#709503]">
                Add/Manage Advertisements
            </Link>
            <Link to="/donate-support" className="flex bg-white items-center font-bold hover:text-[#709503]">
                Donate to Support
            </Link>
            <Link to="/order-status" className="flex bg-white items-center font-bold hover:text-[#709503]">
                Order Status
            </Link>
            <Link to="/manage-restaurant" className="flex bg-white items-center font-bold hover:text-[#709503]">
                My Restaurant
            </Link>
            <Link to="/user-profile" className="flex bg-white items-center font-bold hover:text-[#709503]">
                User Profile
            </Link>
            <Button className="flex items-center px-3 font-bold hover:bg-[#709503]" onClick={() => logout()}>
                Log Out
            </Button>
        </>
    )
}

export default MobileNavLinks;