import { useSelector } from "react-redux";
import ListForm from "../components/ListForm";
import { Navigate } from "react-router-dom";

export default function NewList() {
    const { user } = useSelector(state => state.user);

    return user ?
        <ListForm title={"New Property Listing : )"} />
        :
        <Navigate to={"/sign-in"} />
}