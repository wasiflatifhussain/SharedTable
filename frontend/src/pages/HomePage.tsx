import ui1 from "../assets/ui1.png";
import ui2 from "../assets/ui2.png";
import ui3 from "../assets/ui3.png";
import ui4 from "../assets/ui4.png";
import appDownloadImage from "../assets/appDownload.png";
import "./HomePage.css";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const handleSearchSubmit = (searchFormValues: SearchForm) => {
        navigate({
            pathname: `/search/${searchFormValues.searchQuery}`,
        });
    };

    return (
        <div className="flex flex-col gap-12">
            <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
                <h1 className="text-4xl font-bold tracking-tight text-[#709503]">
                    Find a restaurant serving leftovers right away
                </h1>
                <span className="text-xl">
                    Look for your favourite restaurants and cuisines  with a single click!
                </span>
                <SearchBar placeHolder="Search by City or Town" onSubmit={handleSearchSubmit} />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
                <div className="flex">
                    <img src={ui4} className="ui4-image" alt="ui1"/>
                    {/* <img src={ui1} className="ui1-image" alt="ui1" style={{width: "60%", height: "45%"}} />
                    <img src={ui2} className="ui2-image" alt="ui2" style={{marginTop: "5vh", marginLeft: "-3vh", width: "60%", height: "43%"}} />
                    <img src={ui3} className="hidden sm:block" alt="ui3" style={{marginTop: "7vh", marginLeft: "-2.5vh", width: "60%", height: "45%"}} /> */}
                </div>
                <div className="flex flex-col items-center justify-center gap-4 text-center downloadmsg">
                    <span className="font-bold text-3xl tracking-tighter">
                        Share food and move towards sustainability!
                    </span>
                    <span>
                        Download the SharedTable App for faster ordring and personalized recommendations.
                    </span>
                    <img src={appDownloadImage} alt="download" />
                </div>
            </div>
        </div>
    )
}

export default HomePage;