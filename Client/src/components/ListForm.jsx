import { Form } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";

export default function ListForm({ title }) {
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
                        <Input className="shadow-lg border bg-white" type='file' id='images' accept='image/*' multiple />
                        <Button className="border border-green-500 transition-all hover:-translate-x-1 hover:bg-green-600 hover:text-white">Upload</Button>
                    </div>
                    <Button primaryColor={true}>Create</Button>
                </div>
            </Form>
        </main>
    )
}