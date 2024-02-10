import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle';
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import Card from "../components/Card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
    SwiperCore.use([Navigation]);
    const [offerlist, setOfferList] = useState([]);
    const { data: saleList } = useQuery({
        queryKey: ['saleList'],
        queryFn: getSaleList
    })
    const rentList = useLoaderData();
    useEffect(() => {
        async function getOfferList() {
            const response = await fetch("/jd/list/get?offer=true&limit=4");
            const data = await response.json();
            if (response.ok) {
                setOfferList(data);
            }
        }
        getOfferList();

    }, [])

    return (
        <div>
            <div className="p-12 flex flex-col gap-4">
                <h1 className="text-4xl text-sky-700 font-bold">
                    <span className="text-sky-900">Explore estate.</span> Find a New Home on the GO.
                </h1>
                <p className="text-lg text-slate-600">
                    We help you find the best place to stay in anywhere in the world. Trusted Place to find home. 
                </p>
                <Link to={'/search'} className="text-green-700">
                    see more
                </Link>
            </div>
            <div>
                <Swiper navigation >
                    {
                        saleList &&
                        saleList.map(listing =>
                            <SwiperSlide key={listing._id}>
                                <div className=" p-1 sm:p-2 h-[325px] md:h-[550px] ">
                                    <img className="h-full w-full object-fill rounded-xl" src={listing.imageUrls} alt="Header images" />
                                </div>
                            </SwiperSlide>)
                    }
                </Swiper>
            </div>
            <div className="p-3 flex flex-col gap-8 mt-5">
                {
                    saleList &&
                    <div className="p-2">
                        <h3 className="text-sky-700 font-semibold text-lg sm:text-2xl">
                            Recent properties for sale:
                        </h3>
                        <Link to={'/search?type=sale'} className="text-green-500">
                            show more
                        </Link>
                        {
                            saleList && <div className="flex flex-col sm:flex-row gap-4 flex-wrap p-3 border-b-2 pb-8">
                                {saleList.map(listing => <Card key={listing._id} listData={listing} />)}
                            </div>
                        }
                    </div>
                }
                {
                    offerlist &&
                    <div className="p-2">
                        <h3 className="text-sky-700 font-semibold text-lg sm:text-2xl">
                            Recent properties on Offer:
                        </h3>
                        <Link to={'/search?offer=true'} className="text-green-500">
                            show more
                        </Link>
                        {
                            offerlist && <div className="flex flex-col sm:flex-row gap-4 flex-wrap p-3 border-b-2 pb-8">
                                {
                                    offerlist.map(listing => <Card key={listing._id} listData={listing} />)
                                }
                            </div>
                        }
                    </div>
                }
                {
                    rentList &&
                    <div className="p-2">
                        <h3 className="text-sky-700 font-semibold text-lg sm:text-2xl">
                            Recent properties for rent:
                        </h3>
                        <Link to={'/search?type=rent'} className="text-green-500">
                            show more
                        </Link>
                        {
                            rentList && <div className="flex flex-col sm:flex-row gap-4 flex-wrap p-3 border-b-2 pb-8">
                                {rentList.map(listing => <Card key={listing._id} listData={listing} />)}
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export async function getRentList() {
    try {
        const response = await fetch("/jd/list/get?type=rent&limit=4");
        const data = await response.json();
        if (response.ok) {
            return data
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getSaleList() {
    const response = await fetch("/jd/list/get?type=sale&limit=4");
    const data = await response.json();
    if (response.ok) {
        return data;
    }
}