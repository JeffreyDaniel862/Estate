import { useSelector } from "react-redux";
import { Form, Navigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Profile() {
    const { user } = useSelector(state => state.user);

    if (!user) return <Navigate to="/sign-in" />

    return (
        <div className="max-w-lg mx-auto shadow-lg border p-3 rounded-lg my-7">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <Form className="flex flex-col gap-4 ">
                <img className="rounded-full w-24 h-24 self-center my-1 cursor-pointer" src={user.avatar} alt="profile" />
                <Input type='text' defaultValue={user.username} id='username' name='username' />
                <Input type='email' defaultValue={user.email} id='email' name='email' />
                <Input type='password' placeHolder="password" id='password' name='password' />
                <Button primaryColor={true}>Update</Button>
                <Button type="button" className="bg-green-700 text-white transition-all hover:bg-green-800 hover:-translate-y-1">Create Listing</Button>
            </Form>
            <div className="flex justify-between mt-5 text-red-600">
                <span className="cursor-pointer transition-all hover:text-red-700 hover:scale-x-105">Delete Account</span>
                <span className="cursor-pointer transition-all hover:text-red-700 hover:scale-x-105">Sign out</span>
            </div>
        </div>
    )
}