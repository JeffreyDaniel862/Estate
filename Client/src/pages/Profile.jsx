import { redirect } from "react-router-dom";

export default function Profile() {
    return (<div>Profile</div>)
}

export const profileLoader = () => {
    const user = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user);
    if (!user.user) return redirect("/sign-in");
    return user;
}