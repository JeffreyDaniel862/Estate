import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Form, Link, redirect, useActionData, useNavigation } from "react-router-dom";

export default function SignIn() {

    const [formData, setFormData] = useState({});

    const data = useActionData();
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    if (data) {
        console.log(data);
    }

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
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(authData)
        });

        if(response.status !== 200) return response;

        return redirect('/')

    } catch (error) {
        console.log(error);
    }
}