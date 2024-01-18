import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaCross } from "react-icons/fa";

export default function Header() {

    const { user } = useSelector(state => state.user);

    return (
        <header className="bg-slate-200 shadow-md">
            <nav className="flex items-center justify-between p-3 max-w-6xl mx-auto">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
                        <span className="text-slate-400">Jeffrey</span>
                        <span className="text-slate-600"><FaCross /></span>
                    </h1>
                </Link>
                <form className="bg-slate-100 rounded-lg p-3 flex items-center">
                    <input id="search" type="text" placeholder="search..." className="bg-transparent w-24 sm:w-64 focus:outline-none" />
                    <FaSearch className="text-slate-600" />
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