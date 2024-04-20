import { Link } from "react-router-dom";

type Props = {
    total: number;
    city: string;
};

const capitalizeFirstLetter = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const SearchResultInfo = ({total,city}: Props) => {
    const capitalizedCity = capitalizeFirstLetter(city);
    return (
        <div className="text-xl font-bold flex flex-col gap-3 justify-between lg:items-center lg:flex-row" style={{padding: "30px 0px"}}>
            <span style={{display: "flex", fontSize: "17px"}}>
                <p style={{marginRight: "5px"}}>{total} Restaurants found in {capitalizedCity}</p>
                <Link to="/" className="mt-1 ml-1 first-line:text-sm font-semibold underline cursor-pointer text-blue-500">Change Location</Link>
            </span>
        </div>
    )
};
    
export default SearchResultInfo;