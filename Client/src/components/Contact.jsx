import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { IoIosMail } from "react-icons/io";
import Pins from "./Pins";
import Input from "./Input";
import Button from "./Button";
import { FaRegPaperPlane, FaRegUser, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Contact({ listData, cancel }) {

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["userDetail"],
        queryFn: () => getUserDetail(listData.userRef)
    });

    const [message, setMessage] = useState("");

    if (isError) {
        return <p>{error.status} error</p>
    }

    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && !isError && data &&
                <div className="w-full border border-gray-500 p-2 rounded-md hover:shadow-md">
                    <FaArrowLeft onClick={() => cancel()} />
                    <p className="text-lg my-2 text-sky-600 font-semibold text-center">"{listData.name}" proprietor Info</p>
                    <div className="flex justify-between gap-1 p-2 sm:p-5">
                        <Pins className={"text-sky-700 font-semibold"}><FaRegUser className="text-lg" />  {data.username}</Pins>
                        <Pins className={"text-sky-700"}><IoIosMail className="text-xl" />  {data.email}</Pins>
                    </div>
                    <div className="flex flex-col mt-4 sm:flex-row gap-3 md:gap-4">
                        <Input onChange={e => setMessage(e.target.value)} textarea={true} className={"flex-1"} type="text" placeholder="Message..." />
                        <Link to={`mailto:${data.email}?subject=Regarding ${listData.name}&body=`} className="self-center">
                            <Button secondaryColor={true} className={" flex justify-center items-center gap-2 "}><FaRegPaperPlane />Send Message</Button>
                        </Link>
                    </div>
                </div>}
        </>
    )

}

export const getUserDetail = async (id) => {
    try {
        const response = await fetch("/jd/user/detail/" + id);
        if (!response.ok) {
            const error = new Error("Unable to fetch detail");
            error.status = response.status;
            error.info = await response.json();
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
    }

}