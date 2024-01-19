import { useDispatch, useSelector } from "react-redux";
import { Form, Link, Navigate, useActionData, useFetcher, useNavigate, useNavigation, useSubmit } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { app } from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { userAction } from "../store/userSlice.js";
import { useQuery } from "@tanstack/react-query";
import UserList from "../components/UserList.jsx";

export default function Profile() {

    const { user } = useSelector(state => state.user);

    const initialUploadData = {
        isUploading: false,
        uploadPercentage: 0,
        uploadError: null
    };
    const imageRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [uploadData, setUploadData] = useState(initialUploadData);
    const [formData, setFormData] = useState({ id: user?.id });
    const [showList, setShowList] = useState(false);
    const submit = useSubmit();
    const data = useActionData();
    const dispatch = useDispatch();
    const Navigation = useNavigation();
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const { data: listData, isLoading, isError, error } = useQuery({
        queryKey: ["userList"],
        queryFn: () => fetchUserList(user?.id)
    });
    const { data: deleteData, state } = fetcher;
    const isDeleting = state === "submitting";

    useEffect(() => {
        if (deleteData && deleteData.success) {
            dispatch(userAction.delete());
            navigate("/sign-in");
        }
    }, [deleteData, dispatch]);

    useEffect(() => {
        if (data && data.success) {
            dispatch(userAction.update(data));
        }
        if (data && data.signedOut) {
            dispatch(userAction.signOut());
            navigate("/sign-in")
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', snapshot => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadData({ ...uploadData, uploadPercentage: progress, isUploading: true });
        },
            error => {
                setUploadData({ ...uploadData, uploadError: error, isUploading: false })
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                        setUploadData({ ...uploadData, isUploading: false });
                        setFormData({ ...formData, avatar: downloadURL })
                    });
            }
        );
    };

    const isUpdating = Navigation.state === "submitting" && Navigation.formMethod === "post";

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(formData, { method: "POST" });
    }

    const handleSignOut = () => {
        submit(null, { method: "PATCH" });
    }

    const handleDelete = () => {
        const proceed = window.confirm("This action cannot be undone \n Are you sure ?");
        if (proceed) fetcher.submit({ id: user.id }, { method: "DELETE", action: "/delete" });
    }

    const handleShowList = () => {
        setShowList(prevOption => !prevOption);
    }

    let content = ''

    if (uploadData.isUploading) {
        if (uploadData.uploadError) {
            content = <span className="text-red-700 text-center">Error Occurred while image upload :(</span>
        }
        if (uploadData.uploadPercentage > 0 && uploadData.uploadPercentage < 100) {
            content = <progress
                className="self-center [&::-webkit-progress-bar]:rounded-md [&::-webkit-progress-value]:rounded-md   
                [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-sky-500
                 [&::-moz-progress-bar]:bg-slate-300" max={100} value={uploadData.uploadPercentage}>{uploadData.uploadPercentage}%</progress>
        }
        if (uploadData.uploadPercentage === 100) {
            content = <span className="text-green-600 text-center">Image uploaded Successfully</span>
        }
    }

    return !user ? <Navigate to="/sign-in" /> : (
        <div className="max-w-sm sm:max-w-lg mx-auto shadow-lg border p-3 rounded-lg my-7">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <Form className="flex flex-col gap-4 " onSubmit={handleSubmit} >
                <input
                    type="file"
                    ref={imageRef}
                    hidden
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                />
                <img
                    className="rounded-full w-24 h-24 self-center my-1 cursor-pointer"
                    src={formData.avatar || user.avatar}
                    alt="profile"
                    onClick={() => imageRef.current.click()}
                />
                {content}
                <Input type='text' defaultValue={user.username} onChange={handleChange} id='username' name='username' />
                <Input type='email' defaultValue={user.email} onChange={handleChange} id='email' name='email' />
                <Input type='password' placeholder="password" onChange={handleChange} id='password' name='password' />
                <Button disabled={isUpdating} primaryColor={true} type="submit">{isUpdating ? "Updating..." : "Update"}</Button>
                <Link to={"create-list"}>
                    <Button type="button" className="bg-green-700 w-full text-white transition-all hover:bg-green-800 hover:-translate-y-1">Create Listing</Button>
                </Link>
            </Form>
            <div className="flex justify-between mt-5 text-red-600">
                <span onClick={handleDelete} className="cursor-pointer transition-all hover:text-red-700 hover:scale-x-105">{isDeleting ? "Deleting account" : "Delete Account"}</span>
                <span onClick={handleSignOut} className="cursor-pointer transition-all hover:text-red-700 hover:scale-x-105">Sign out</span>
            </div>
            {data &&
                <div>
                    <p className={`text-center my-3 ${data.success ? 'text-green-500' : 'text-red-500'}`}>{data.success ? "Success" : data.message}</p>
                </div>
            }
            <Button onClick={handleShowList} type="button" className={"text-green-700 w-full lowercase"}>{showList? "Hide" : "Show"} listing</Button>
            {
                !isLoading && showList && (isError? <p className="text-red-700 text-center">{error && error.info?.message || "Unable to fetch user's properties"}</p> : <UserList listData={listData} />)
            }
        </div>
    )
}

export const profileUpdateAction = async ({ request }) => {
    const method = request.method;
    if (method === "POST") {
        const data = await request.formData();
        const userData = {}
        data.forEach((value, key) => userData[key] = value);
        try {
            const response = await fetch(`jd/user/update/${userData.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            return response;

        } catch (error) {
            console.log(error)
        }
    }
    if (method === "PATCH") {
        try {
            const response = await fetch("jd/auth/signout");
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

export const deleteAction = async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');
    try {
        const response = await fetch(`jd/user/delete/${id}`, {
            method: "DELETE"
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const fetchUserList = async (id) => {
    const response = await fetch("/jd/user/list/" + id);

    if (!response.ok) {
        const error = new Error("Error while fetching property list");
        error.status = response.status;
        error.info = await response.json();
        throw error;
    }
    const data = await response.json();
    return data
}
