import { useMutation } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import { queryClient } from "../utils/http";
import { Link } from "react-router-dom";

export default function UserList({ listData }) {

    const { mutate, isError, error } = useMutation({
        mutationFn: deleteUserList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userList"] });
        }
    });

    const handleDelete = (id) => {
        const procced = window.confirm("Are you sure to delete the property listing ?");
        if (procced) mutate(id);
    }

    let content;

    if (listData.length > 0) {
        content = listData.map(list => {
            return (
                <div className="p-3 border rounded-lg hover:shadow-lg" key={list._id}>
                    <div className="flex gap-4 items-center justify-between">
                        <img className="w-40 h-40 object-cover rounded-lg transition-all hover:scale-110" src={list.imageUrls[0]} alt="property image" />
                        <p className="text-lg font-semibold">{list.name}</p>
                        <div className="flex flex-col items-center justify-between min-h-24 h-full">
                            <p onClick={() => handleDelete(list._id)} className="self-start text-xl font-bold text-red-700 cursor-pointer transition-all hover:scale-y-125"><FaTrash /></p>
                            <p className="self-end text-xl font-bold text-green-700 cursor-pointer transition-all hover:scale-y-125">
                                <Link to={`edit-list/${list._id}`}><FaEdit /></Link>
                            </p>
                        </div>
                    </div>
                    {
                        isError && <p className="mt-2 text-red-700 text-center">{error && error.info?.message || "Unable to delete property"}</p>
                    }
                </div>
            )
        })
    } else {
        content = <p>You haven't listed any property. Click Create listing button above to create one</p>
    }
    return <>
        <h1 className="text-center font-bold text-xl my-5">Your Listing</h1>
        {content}
    </>;
}

export const deleteUserList = async (id) => {
    const response = await fetch("/jd/list/delete/" + id, {
        method: "delete"
    });
    if (!response.ok) {
        const error = new Error("Error deleting property");
        error.status = response.status;
        error.info = await response.json();
        throw error;
    }
    const data = await response.json();
    return data;
}