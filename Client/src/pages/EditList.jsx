import { useSelector } from "react-redux";
import ListForm from "../components/ListForm";
import { Navigate, json, useLoaderData } from "react-router-dom";

export default function EditList() {
    const { user } = useSelector(state => state.user);
    const listData = useLoaderData();
    return user ?
        <ListForm title={"Edit Property : )"} method={"patch"} listData={listData} />
        :
        <Navigate to={"/sign-in"} />
}

export const listLoader = async ({ request, params }) => {
    const response = await fetch("/jd/list/view/" + params.id);
    if (!response.ok) {
        console.log(await response.json());
        const errorData = await response.json();
        throw json({ message: errorData.message || "Unable to fetch data" }, { status: errorData.status || 500 })
    }
    const data = await response.json();
    return data;
}