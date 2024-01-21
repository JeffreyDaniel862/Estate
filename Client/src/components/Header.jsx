import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaCross } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header() {

    const { user } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const queryTerm = urlParams.toString();
        navigate(`/search?${queryTerm}`);
    }

    useEffect(() => {
        console.log("hello");
        const urlParams = new URLSearchParams(location.search);
        const paramsSearchTerm = urlParams.get('searchTerm');
        if(paramsSearchTerm){
            setSearchTerm(paramsSearchTerm)
        }
    }, [location.search]);

    return (
        <header className="bg-slate-200 shadow-md">
            <nav className="flex items-center justify-between p-3 max-w-6xl mx-auto">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
                        <span className="text-slate-400">J</span>
                        <span className="text-slate-600"><FaCross /></span>
                        <span className="text-slate-400">D</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className="bg-slate-100 rounded-lg p-2 sm:p-3 flex items-center">
                    <input onChange={e => setSearchTerm(e.target.value)} value={searchTerm} id="search" type="text" placeholder="search..." className="bg-transparent w-36 sm:w-64 focus:outline-none" />
                    <button type="submit"><FaSearch className="text-slate-600" /></button>
                </form>
                <ul className="flex gap-4 items-center">
                    <li className="text-slate-700 hidden sm:inline hover:underline"><Link to="/">Home</Link></li>
                    <li className="text-slate-700 hidden sm:inline hover:underline"><Link to="/about">About</Link></li>
                    <li className="text-slate-700 hover:underline">
                        {
                            user ?
                                <Link to="/profile"><img className="rounded-full h-10 w-10 object-cover" src={user.avatar} alt="profile" /></Link>
                                : <Link to="/sign-in">Sign-In</Link>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}