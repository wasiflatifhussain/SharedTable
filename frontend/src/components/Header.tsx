import { Link } from "react-router-dom";
import logo from "../assets/circle-logo.png";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

const Header = () => {
    return (
        <div className="border-b-2 border-b-[#048a52] py-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold tracking-tight text-[#048a52]" style={{display: "flex"}}><img src={logo} alt="logo" style={{height: "8vh"}} /> <p style={{marginTop: "1.3vh", marginLeft: "1vh"}}><p>SharedTable</p><p style={{fontSize: "14px", marginTop: "-7px"}}>Sharing Sustainably</p></p></Link>
                <div className="md:hidden">
                    <MobileNav />
                </div>  
                <div className="hidden md:block">
                    <MainNav />
                </div>
            </div>
        </div>
    )
}
  
export default Header;
