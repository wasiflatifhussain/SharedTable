import { Link } from "react-router-dom";
import logo from "../assets/circle-logo.png";

const Footer = () => {
    return (
        <div className="bg-[#048a52] py-10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link to="/" className="text-3xl font-bold tracking-tight" style={{display: "flex"}}>
                    <img src={logo} alt="logo" style={{height: "8vh"}} /> <p style={{marginTop: "1.3vh", marginLeft: "1vh"}}></p>
                    <span className="text-3xl text-[#bae634] font-bold tracking-tight" style={{marginTop: "1.3vh"}}>
                        SharedTable
                    </span>
                </Link>
                <span className="text-[#bae634] font-bold tracking-tight flex gap-4">
                    <span>Privacy Policy</span>
                    <span>Terms and Conditions</span>
                </span>
            </div>
        </div>
    )
}

export default Footer;