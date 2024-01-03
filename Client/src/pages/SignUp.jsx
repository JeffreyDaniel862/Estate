import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "react-router-dom";

export default function SignUp() {
    return (
        <div className="p-3 mx-auto max-w-lg my-7 shadow-lg border rounded-md">
            <h1 className="text-3xl font-semibold text-center mb-7">Sign-Up</h1>
            <form className="flex flex-col gap-4">
                <Input type="text" placeholder="Username" name="username" id="username" />
                <Input type="email" placeholder="Email" name="email" id="email" />
                <Input type="password" placeholder="Password" name="password" id="password" />
                <Button primaryColor={true} animate={true}>Sign-Up</Button>
                <Button secondaryColor={true}>Sign-up with Google</Button>
                <div className="flex items-center gap-4">
                    <p className="text-slate-900">Already have an account ?</p>
                    <Link to="/sign-in"><p className="text-red-700 hover:text-red-500" >Sign-In</p></Link>
                </div>
            </form>
        </div>
    )
}