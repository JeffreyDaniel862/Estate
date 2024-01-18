import { FaTrash, FaEdit  } from "react-icons/fa";

export default function UserList({ listData }) {
    let content;

    if (listData.length > 0) {
        content = listData.map(list => {
            return (
                <div key={list._id} className="flex gap-4 p-3 items-center justify-between border rounded-lg hover:shadow-lg">
                    <img className="w-40 h-40 object-cover rounded-lg transition-all hover:scale-110" src={list.imageUrls[0]} alt="property image" />
                    <p className="text-lg font-semibold">{list.name}</p>
                    <div className="flex flex-col items-center justify-between min-h-24 h-full">
                        <p className="self-start text-xl font-bold text-red-700 cursor-pointer transition-all hover:scale-y-125"><FaTrash  /></p>
                        <p className="self-end text-xl font-bold text-green-700 cursor-pointer transition-all hover:scale-y-125"><FaEdit  /></p>
                    </div>
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