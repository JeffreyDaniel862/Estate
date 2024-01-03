import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa"

export default function Header() {
    return (
        <header className="bg-slate-200 shadow-md">
            <nav className="flex items-center justify-between p-3 max-w-6xl mx-auto">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-400">Jeffrey</span>
                        <span className="text-slate-600">Daniel</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 rounded-lg p-3 flex items-center">
                    <input type="text" placeholder="search..." className="bg-transparent w-24 sm:w-64 focus:outline-none" />
                    <FaSearch className="text-slate-600" />
                </form>
                <ul className="flex gap-4">
                    <li className="text-slate-700 hidden sm:inline hover:underline"><Link to="/">Home</Link></li>
                    <li className="text-slate-700 hidden sm:inline hover:underline"><Link to="/about">About</Link></li>
                    <li className="text-slate-700 hover:underline"><Link to="/sign-in">Sign-In</Link></li>
                </ul>
            </nav>
        </header>
    )
}