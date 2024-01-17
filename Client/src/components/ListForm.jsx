import { Form } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';

export default function ListForm({ title }) {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: []
    });
    const initialUploadInfo = {
        isUploading: false,
        uploadError: false
    }
    const [uploadInfo, setUploadInfo] = useState(initialUploadInfo);
    function handleImageUpload() {
        console.log("hello", formData, files)
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            console.log("running")
            setUploadInfo({ ...uploadInfo, isUploading: true })
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(uploadImage(files[i]));
            }
            Promise.all(promises)
                .then(urls => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setUploadInfo(initialUploadInfo);
                })
                .catch(error => setUploadInfo({ isUploading: false, uploadError: error }));

        } else {
            console.log("not running");
            setUploadInfo({ isUploading: false, uploadError: "Min image required, Max upto 6 images" })
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

    return (
        <main className="p-4 mx-auto max-w-4xl md:max-w-5xl border shadow-lg my-7 rounded-lg">
            <h1 className="text-3xl text-center mb-7 font-semibold">{title}</h1>
            <Form className="flex gap-4 flex-col sm:flex-row">
                <div className="flex flex-col gap-4 flex-1">
                    <Input type="text" placeholder="Property Name" id="name" name="name" required />
                    <Input textarea={true} placeholder="Description..." id='description' name="description" required />
                    <Input type='text' placeholder='Address ...' id='address' name='address' required />
                    <div className="flex gap-6 flex-wrap">
                        <Input checkBox={true} labelName='Sell' id='sale' />
                        <Input checkBox={true} labelName='Rent' id='rent' />
                        <Input checkBox={true} labelName='Parking Spot' id='parking' />
                        <Input checkBox={true} labelName='Furnished' id='furnished' />
                        <Input checkBox={true} labelName='Offer' id='offer' />
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <Input labeledInput={true} type='number' labelName='Beds' id='bedrooms' name='bedrooms' required />
                        <Input labeledInput={true} type='number' labelName='Baths' id='bathrooms' name='bathrooms' required />
                        <Input labeledInput={true} type='number' labelName='Regular Price' id='regularPrice' name='regularPrice' required />
                        <Input labeledInput={true} type='number' labelName='Offer Price' id='offerPrice' name='offerPrice' required />
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
                            <div key={url} className="flex justify-between items-center p-3 border rounded-lg shadow-md">
                                <img src={url} alt="Estate image" className="w-40 h-40 object-cover rounded-xl" />
                                <p className="self-start text-xl font-bold text-red-700 cursor-pointer transition-all hover:scale-x-125">X</p>
                            </div>
                        )
                    }
                    <Button disabled={uploadInfo.isUploading} primaryColor={true}>Create</Button>
                </div>
            </Form>
        </main>
    )
}