import { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Form, Link, useNavigate, useActionData, useNavigation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userAction } from "../store/userSlice";

export default function SignIn() {

    const [formData, setFormData] = useState({});

    const dispatch = useDispatch();

    const data = useActionData();
    const navigation = useNavigation();
    const navigate = useNavigate();

    const isSubmitting = navigation.state === "submitting";

    useEffect(() => {
        if (data && data.success) {
            console.log(data);
            dispatch(userAction.login(data));
            navigate('/');
        }
    }, [data, dispatch, navigate]);
    

    function handleChange(event) {

        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    return (
        <div className="p-3 mx-auto max-w-xs sm:max-w-lg my-7 shadow-lg border rounded-md">
            <h1 className="text-3xl font-semibold text-center mb-7">Sign-In</h1>
            <Form method="post" className="flex flex-col gap-4">
                <Input type="email" placeholder="Email" name="email" id="email" onChange={handleChange} />
                <Input type="password" placeholder="Password" name="password" id="password" onChange={handleChange} />
                <Button disabled={isSubmitting} primaryColor={true} animate={true}>{isSubmitting ? "Submitting..." : "Sign-In"}</Button>
                <Button secondaryColor={true}>Sign-in with Google</Button>
                <div className="flex items-center gap-4">
                    <p className="text-slate-900">Do not have an account ?</p>
                    <Link to="/sign-up"><p className="text-red-700 hover:text-red-500" >Sign-Up</p></Link>
                </div>
            </Form>
            {
                data && <div>
                    <p className={`text-center my-3 ${data.statusCode ? 'text-red-500' : 'text-green-500'}`}>{data.message}</p>
                </div>
            }
        </div>
    )
}

export const signinAction = async ({ request }) => {
    const data = await request.formData();
    const authData = {
        email: data.get('email'),
        password: data.get('password')
    };

    try {
        const response = await fetch('/jd/auth/signin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(authData)
        });

        return response;

    } catch (error) {
        console.log(error);
    }
}