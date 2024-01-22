import { Link } from "react-router-dom";
import Pins from "./Pins";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Card({ listData }) {
    return (
        <div className=" bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] ">
            <Link to={`/list/${listData._id}`}>
                <img src={listData.imageUrls[0]} alt="list image" className=" h-[320px] sm:h-[220px] w-full object-cover transition-all duration-300 hover:scale-110" />
                <div className="p-3 flex flex-col gap-3">
                    <p className="truncate font-semibold text-lg sm:text-2xl"> {listData.name}</p>
                    <Pins className="text-sky-700 my-3"><FaMapMarkerAlt /> {listData.address}</Pins>
                    <p className="line-clamp-2">{listData.description}</p>
                    <p>₹ {listData.offer ? listData.discountPrice.toLocaleString("en-IN") : listData.regularPrice.toLocaleString("en-IN")}{listData.type === "rent" && "/month"}</p>
                    <div className="flex gap-4 text-sky-700 font-semibold">
                        <p>{listData.bedrooms > 1 ? `${listData.bedrooms} beds` : `${listData.bedrooms} bed`} </p>
                        <p>{listData.bathrooms > 1 ? `${listData.bathrooms} baths` : `${listData.bathrooms} bath`} </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}