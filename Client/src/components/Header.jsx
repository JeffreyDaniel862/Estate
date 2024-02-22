import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {

    const { user } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [clicked, setClicked] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const queryTerm = urlParams.toString();
        navigate(`/search?${queryTerm}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const paramsSearchTerm = urlParams.get('searchTerm');
        if (paramsSearchTerm) {
            setSearchTerm(paramsSearchTerm)
        }
    }, [location.search]);

    return (
        <header className="bg-slate-200 shadow-md">
            <nav className="flex items-center justify-between p-3 max-w-6xl mx-auto">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
                        <span className="text-sky-400 text-sm sm:text-2xl">J</span>
                        <span className="text-sky-600">Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className="bg-slate-100 rounded-2xl p-2 sm:p-3 flex items-center">
                    <input onChange={e => setSearchTerm(e.target.value)} value={searchTerm} id="search" type="text" placeholder="search..." className="bg-transparent w-36 sm:w-64 focus:outline-none" />
                    <button type="submit"><FaSearch className="text-slate-600" /></button>
                </form>
                <ul className="flex gap-4 items-center transition-all">
                    <li className="text-slate-700 hidden sm:inline hover:underline"><Link to="/">Home</Link></li>
                    {
                        user && <li className="text-slate-700 hidden sm:inline hover:underline"><Link to="/profile">Profile</Link></li>
                    }
                    <li className="text-slate-700 hidden sm:inline hover:underline">
                        {
                            user ?
                                <img className="rounded-full h-10 w-10 object-cover" src={user.avatar} alt="profile" />
                                : <Link to="/sign-in">Sign-In</Link>
                        }
                    </li>
                    <li className="inline sm:hidden">
                        {clicked ? <FaTimes onClick={() => setClicked(false)} /> : <FaBars onClick={() => setClicked(true)} />}
                        {
                            clicked && user &&
                            <ul className= {`absolute text-lg font-serif top-16 right-0 w-1/2 flex flex-col justify-start p-3 rounded-lg shadow-lg bg-slate-200 ${clicked ? 'translate-x-0' : 'translate-x-[250px]'}`}>
                                <li className="flex gap-4 mb-3">
                                    <img className="w-10 h-10 rounded-full object-cover" src={user.avatar} alt="profile" />
                                    <p className="font-semibold">{user.username}</p>
                                </li>
                                <li>
                                    <Link onClick={() => setClicked(false)} to={'/'}>Home</Link>
                                </li>
                                <li>
                                    <Link onClick={() => setClicked(false)} to={'/profile'}>Profile</Link>
                                </li>
                                <li>
                                    <Link onClick={() => setClicked(false)} to={'/profile/create-list'}>Create Property</Link>
                                </li>
                            </ul>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}