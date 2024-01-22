import { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Card from "../components/Card";

export default function Search() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        searchTerm: "",
        type: "all",
        offer: false,
        parking: false,
        furnished: false,
        sort: "createdAt",
        order: "desc"
    });

    const [dataInfo, setDataInfo] = useState({
        isLoading: false,
        error: null,
        data: []
    })
    console.log(dataInfo);
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const paramsObj = {};
        urlParams.forEach((value, key) => {
            if (key === "offer" || key === "parking" || key === "furnished") {
                paramsObj[key] = value === "true" ? true : false;
            } else {
                paramsObj[key] = value
            }
        });
        setFormData({ ...formData, ...paramsObj });

        const getData = async () => {
            setDataInfo({ ...dataInfo, isLoading: true });
            const searchQuery = urlParams.toString();
            const response = await fetch("/jd/list/get/?" + searchQuery);
            const data = await response.json();
            if (!response.ok) {
                return setDataInfo({ ...dataInfo, isLoading: false, error: data })
            }
            setDataInfo({ ...dataInfo, isLoading: false, data: data });
        }

        getData();
    }, [location.search]);

    function handleChange(e) {
        if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
            setFormData({ ...formData, type: e.target.id })
        }
        if (e.target.id === "offer" || e.target.id === "parking" || e.target.id === "furnished") {
            setFormData({ ...formData, [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false });
        }
        if (e.target.id === "searchTerm") {
            setFormData({ ...formData, searchTerm: e.target.value });
        }
        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "createdAt";
            const order = e.target.value.split("_")[1] || "desc";
            setFormData({ ...formData, sort, order });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', formData.searchTerm);
        urlParams.set('type', formData.type);
        urlParams.set('offer', formData.offer);
        urlParams.set('parking', formData.parking);
        urlParams.set('furnished', formData.furnished);
        urlParams.set('sort', formData.sort);
        urlParams.set('order', formData.order);
        const searchParams = urlParams.toString();
        navigate(`/search?${searchParams}`)
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 ">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit}>
                    <Input onChange={handleChange} value={formData.searchTerm} labeledInput={true} labelClass={"font-semibold"} labelName={"Search term : "} id="searchTerm" placeholder="Search..." />
                    <div className="flex gap-4 flex-wrap mt-5">
                        <label className="font-semibold">Type:</label>
                        <Input onChange={handleChange} checked={formData.type === "all"} checkBox={true} labelName={"Rent/Sale"} id="all" />
                        <Input onChange={handleChange} checked={formData.type === "rent"} checkBox={true} labelName={"Rent"} id="rent" />
                        <Input onChange={handleChange} checked={formData.type === "sale"} checkBox={true} labelName={"Sale"} id="sale" />
                        <Input onChange={handleChange} checked={formData.offer} checkBox={true} labelName={"Offer"} id="offer" />
                    </div>
                    <div className="flex gap-4 flex-wrap mt-5">
                        <label className="font-semibold">Amenities:</label>
                        <Input onChange={handleChange} checked={formData.parking} checkBox={true} labelName={"Parking"} id="parking" />
                        <Input onChange={handleChange} checked={formData.furnished} checkBox={true} labelName={"Furnished"} id="furnished" />
                    </div>
                    <div className="flex gap-4 items-center flex-wrap mt-5">
                        <label className="font-semibold" htmlFor="sort_order">Sort : </label>
                        <select defaultValue="createdAt_desc" onChange={handleChange} className="p-3 rounded-lg border-none" name="sort_order" id="sort_order">
                            <option value="regularPrice_desc">price high to low</option>
                            <option value="regularPrice_asc">price low to high</option>
                            <option value="createdAt_desc">latest</option>
                            <option value="createdAt_asc">oldest</option>
                        </select>
                    </div>
                    <Button className={" mt-5 w-full "} primaryColor={true}>Search</Button>
                </form>

            </div>
            <div>
                <h1 className="p-3 mt-5 text-3xl font-semibold sm:text-4xl text-sky-700">result:</h1>
                <div className=" p-3 flex flex-col sm:flex-row flex-wrap gap-8">
                    {!dataInfo.isLoading && dataInfo.data && dataInfo.data.map(listdata => <Card key={listdata._id} listData={listdata} />)}
                    {!dataInfo.isLoading && dataInfo.data.length === 0 && <p className="text-sky-700 p-3 text-2xl">No List Found :(</p>}
                    {dataInfo.isLoading && <div className="w-full text-center"><Loading /></div>}
                </div>
            </div>
        </div>
    )
}