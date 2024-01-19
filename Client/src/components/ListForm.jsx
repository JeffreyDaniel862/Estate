import { Form, redirect, useActionData, useNavigation, useSubmit } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { useSelector } from "react-redux";

export default function ListForm({ title, method, listData }) {
    const { user } = useSelector(state => state.user);

    const initialUploadInfo = {
        isUploading: false,
        uploadError: false
    }
    const initialListData = {
        userRef: user?.id,
        name: "",
        description: "",
        address: "",
        type: "sale",
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 0,
        bathrooms: 0,
        regularPrice: 0,
        discountPrice: 0,
        imageUrls: []
    }
    const submit = useSubmit();
    const navigation = useNavigation();
    const data = useActionData();
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState(initialListData);
    const [uploadInfo, setUploadInfo] = useState(initialUploadInfo);

    const isSumbitting = navigation.state === "submitting";

    useEffect(() => {
        if (listData) {
            const { __v, updatedAt, createdAt, _id: someid, userRef: someRef, ...propertyData } = listData;
            setFormData(propertyData);
        }
    }, [])

    function handleImageUpload() {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploadInfo({ ...uploadInfo, isUploading: true })
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(uploadImage(files[i]));
            }
            Promise.all(promises)
                .then(urls => {
                    console.log(urls);
                    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ...urls] });
                    setUploadInfo(initialUploadInfo);
                })
                .catch(error => setUploadInfo({ isUploading: false, uploadError: error }));

        } else {
            setUploadInfo({ isUploading: false, uploadError: "Min image required, Max upto 6 images" });
        }
    }

    const uploadImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log(`Uploading... ${progress}%`);
                },
                error => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        resolve(downloadURL);
                    });
                }
            )
        })
    };

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "sale" || name === "rent") {
            setFormData({ ...formData, type: name });
        } else if (name === "parking" || name === "furnished" || name === "offer") {
            setFormData({ ...formData, [name]: e.target.checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    function handleSumbit(e) {
        // error && setError(null);
        e.preventDefault();
        if (formData.imageUrls.length < 1) {
            return setError("Upload atleast one image of the property");
        }
        submit(formData, { method: method });
    }

    return (
        <main className="p-4 mx-auto max-w-4xl md:max-w-5xl border shadow-lg my-7 rounded-lg">
            <h1 className="text-3xl text-center mb-7 font-semibold">{title}</h1>
            <Form onSubmit={handleSumbit} className="flex gap-4 flex-col sm:flex-row">
                <div className="flex flex-col gap-4 flex-1">
                    <Input onChange={handleChange} defaultValue={listData ? listData.name : ""} type="text" placeholder="Property Name" id="name" name="name" required />
                    <Input onChange={handleChange} defaultValue={listData ? listData.description : ""} textarea={true} placeholder="Description..." id='description' name="description" required />
                    <Input onChange={handleChange} defaultValue={listData ? listData.address : ""} type='text' placeholder='Address ...' id='address' name='address' required />
                    <div className="flex gap-6 flex-wrap">
                        <Input onChange={handleChange} defaultValue={listData ? listData.type : ""} checkBox={true} checked={formData.type && formData.type === "sale"} labelName='Sell' id='sale' name='sale' />
                        <Input onChange={handleChange} defaultValue={listData ? listData.type : ""} checkBox={true} checked={formData.type && formData.type === "rent"} labelName='Rent' id='rent' name="rent" />
                        <Input onChange={handleChange} defaultValue={listData ? listData.parking : ""} checkBox={true} checked={formData.parking} labelName='Parking Spot' id='parking' name="parking" />
                        <Input onChange={handleChange} defaultValue={listData ? listData.furnished : ""} checkBox={true} checked={formData.furnished} labelName='Furnished' id='furnished' name="furnished" />
                        <Input onChange={handleChange} defaultValue={listData ? listData.offer : ""} checkBox={true} checked={formData.offer} labelName='Offer' id='offer' name="offer" />
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <Input onChange={handleChange} defaultValue={listData ? listData.bedrooms : ""} labeledInput={true} type='number' labelName='Beds' id='bedrooms' name='bedrooms' required />
                        <Input onChange={handleChange} defaultValue={listData ? listData.bathrooms : ""} labeledInput={true} type='number' labelName='Baths' id='bathrooms' name='bathrooms' required />
                        <Input onChange={handleChange} defaultValue={listData ? listData.regularPrice : ""} labeledInput={true} type='number' min={0} labelName={`Regular Price ${formData.type === "rent" ? "(₹/month)" : ""}`} id='regularPrice' name='regularPrice' required />
                        {formData.offer && <Input onChange={handleChange} defaultValue={listData ? listData.discountPrice : ""} labeledInput={true} min={0} type='number' labelName={`Discount Price ${formData.type === "rent" ? "(₹/month)" : ""}`} id='discountPrice' name='discountPrice' required />}
                    </div>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                    <p className="font-semibold">
                        Images: <span className="font-normal text-gray-600 ml-2">First image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-2 justify-between">
                        <Input onChange={e => setFiles(e.target.files)} className="shadow-lg border bg-white" type='file' id='images' accept='image/*' multiple />
                        <Button disabled={uploadInfo.isUploading} onClick={handleImageUpload} type='button' className="border border-green-500 transition-all hover:-translate-x-1 hover:bg-green-600 hover:text-white hover:shadow-md">{uploadInfo.isUploading ? "uploading..." : "upload"}</Button>
                    </div>
                    {
                        !uploadInfo.isUploading && uploadInfo.uploadError &&
                        <p className="text-red-700"> {uploadInfo.uploadError} </p>
                    }
                    {
                        formData.imageUrls.length > 0 &&
                        formData.imageUrls.map(url =>
                            <div key={url} className="flex justify-between items-center p-3 border rounded-lg hover:shadow-md">
                                <img src={url} alt="Estate image" className="w-40 h-40 object-cover rounded-xl" />
                                <p className="self-start text-xl font-bold text-red-700 cursor-pointer transition-all hover:scale-x-125">X</p>
                            </div>
                        )
                    }
                    <Button type="submit" disabled={uploadInfo.isUploading || isSumbitting} primaryColor={true}>{method === "patch" ? "Update" : "Create"}</Button>
                    {(error || data) && <p className="text-red-700 text-md">{error || data.message}</p>}
                </div>
            </Form>
        </main>
    )
}

export const listAction = async ({ request, params }) => {
    if (request.method === "POST") {
        const data = await request.formData();
        const userData = {}
        data.forEach((value, key) => userData[key] = value);
        userData.imageUrls = userData.imageUrls.split(",");
        const response = await fetch("/jd/list/create", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.status === 201) {
            return redirect('/profile')
        } else {
            return response;
        };
    }

    if (request.method === "PATCH") {
        const data = await request.formData();
        const userData = {}
        data.forEach((value, key) => userData[key] = value);
        userData.imageUrls = userData.imageUrls.split(",");
        userData.discountPrice = userData.offer=== "true"? userData.discountPrice : 0
        const response = await fetch(`/jd/list/update/${params.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        if (response.status === 200) {
            return redirect('/profile')
        } else {
            return response;
        };
    }

}