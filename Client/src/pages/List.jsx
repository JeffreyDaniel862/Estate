import { useLoaderData } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaTag } from "react-icons/fa";
import Pins from "../components/Pins";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import { useState } from "react";
import Contact from "../components/Contact";

export default function List() {
    SwiperCore.use([Navigation]);
    const listData = useLoaderData();
    const { user } = useSelector(state => state.user);
    const [isContact, setIsContact] = useState(false);
    function handleCancelContact() {
        setIsContact(false);
    }
    return <div>
        <Swiper navigation>
            {listData.imageUrls.map(url => <SwiperSlide key={url}>
                <div className="p-2 h-[225px] md:h-[550px] ">
                    <img className="h-full w-full object-fill rounded-xl" src={url} />
                </div>
            </SwiperSlide>)}
        </Swiper>
        <div className="m-8 sm:p-4 text-slate-700">
            <div className="flex justify-between items-center">
                <p className="font-bold text-2xl sm:text-4xl text-sky-700">{listData.name}</p>
                <p className="bg-red-600 p-1 rounded-md text-white hover:bg-white hover:text-red-500 flex gap-1 items-center justify-center ">
                    <FaTag />
                    <span className="text-xl sm:text-2xl font-semibold">{listData.type === "rent" ? "Rent" : "Sale"}</span>
                </p>
            </div>
            <Pins className="text-sky-700 my-3"><FaMapMarkerAlt /> {listData.address}</Pins>
            <div className="flex gap-4">
                <p>
                    <span className="font-semibold">₹ {listData.offer ? listData.discountPrice.toLocaleString("en-IN") : listData.regularPrice.toLocaleString("en-IN")}</span>{listData.type === "rent" && "/month"}
                </p>
                {listData.offer && (
                    <p className="p-1 bg-sky-700 text-white rounded-md">
                        <span>
                            ₹ {+listData.regularPrice - +listData.discountPrice} discount
                        </span>
                    </p>
                )}
            </div>
            <p className="text-justify  my-3"><span className="font-bold">Description: </span>{listData.description}</p>
            <div className="flex gap-6 sm:gap-8 flex-wrap my-3">
                <Pins className="whitespace-nowrap font-semibold text-sky-700"><FaBed className="text-xl" /> {listData.bedrooms} {listData.bedrooms > 1 ? "beds" : "bed"}</Pins>
                <Pins className="whitespace-nowrap font-semibold text-sky-700"><FaBath className="text-lg" /> {listData.bathrooms} {listData.bathrooms > 1 ? "baths" : "bath"}</Pins>
                <Pins className="whitespace-nowrap font-semibold text-sky-700"><FaParking className="text-xl" /> {listData.parking ? "Parking" : "No parking"}</Pins>
                <Pins className="whitespace-nowrap font-semibold text-sky-700"><FaChair className="text-xl" /> {listData.furnished ? "Furnished" : "Not furnished"}</Pins>
            </div>
            <div className="flex w-full">
                {
                    user && user.id !== listData.userRef && (
                        !isContact ?
                            <Button onClick={() => setIsContact(true)} className=" my-5 w-full sm:w-1/2 mx-auto hover:bg-red-700 hover:shadow-lg " animate={true} secondaryColor={true}>Contact Owner</Button>
                            : <Contact listData={listData} cancel={handleCancelContact} />
                    )
                }
            </div>
        </div>
    </div>
}