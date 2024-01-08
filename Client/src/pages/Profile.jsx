import { useSelector } from "react-redux";
import { Form, Navigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { app } from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";

export default function Profile() {

    const initialUploadData = {
        isUploading: false,
        uploadPercentage: 0,
        uploadError: null,
        uploadedImage : null
    };
    const imageRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [uploadData, setUploadData] = useState(initialUploadData);
    const { user } = useSelector(state => state.user);
    if (!user) return <Navigate to="/sign-in" />

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
            console.log(progress);
            setUploadData({ ...uploadData, uploadPercentage: progress, isUploading: true });
        },
            error => {
                setUploadData({ ...uploadData, uploadError: error, isUploading: false })
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                        console.log(downloadURL);
                        setUploadData({ ...uploadData, isUploading: false, uploadedImage: downloadURL })
                    });
            }
        );
    }

    let content = ''

    if(uploadData.isUploading){
        if(uploadData.uploadError){
            content = <span className="text-red-700 text-center">Error Occurred while image upload :(</span>
        }
        if(uploadData.uploadPercentage > 0 && uploadData.uploadPercentage < 100){
            content = <progress
             className="self-center [&::-webkit-progress-bar]:rounded-md [&::-webkit-progress-value]:rounded-md   
                [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-sky-500
                 [&::-moz-progress-bar]:bg-slate-300" max={100} value={uploadData.uploadPercentage}>{uploadData.uploadPercentage}%</progress>
        }
        if(uploadData.uploadPercentage === 100){
            content = <span className="text-green-600 text-center">Image uploaded Successfully</span>
        }
    }

    return (
        <div className="max-w-lg mx-auto shadow-lg border p-3 rounded-lg my-7">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <Form className="flex flex-col gap-4 ">
                <input
                    type="file"
                    ref={imageRef}
                    hidden
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                />
                <img
                    className="rounded-full w-24 h-24 self-center my-1 cursor-pointer"
                    src={uploadData.uploadedImage || user.avatar}
                    alt="profile"
                    onClick={() => imageRef.current.click()}
                />
                {content}
                <Input type='text' defaultValue={user.username} id='username' name='username' />
                <Input type='email' defaultValue={user.email} id='email' name='email' />
                <Input type='password' placeholder="password" id='password' name='password' />
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