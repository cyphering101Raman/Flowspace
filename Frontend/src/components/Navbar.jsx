import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FileText, Home as HomeIcon, User, LogOut, } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authStore";
import axiosInstance from "../utils/axiosInstace";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logouthandler = async () => {
        await axiosInstance.post("/auth/logout");
        dispatch(logout());
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-2xl font-bold text-indigo-600"
                >
                    <FileText className="w-7 h-7" />
                    Flowspace
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-10 text-base font-medium text-gray-700">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 hover:text-indigo-600 transition ${isActive ? "text-indigo-600" : ""
                            }`
                        }
                    >
                        <HomeIcon size={18} />
                        Home
                    </NavLink>

                    <button
                        onClick={() =>
                            navigate(user ? "/document" : "/login")
                        }
                        className="flex items-center gap-2 hover:text-indigo-600 transition"
                    >
                        <FileText size={18} />
                        Documents
                    </button>
                </nav>

                {/* Right */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 text-base font-medium text-gray-700">
                                <User size={18} />
                                <span className="max-w-[140px] truncate">
                                    {user.name}
                                </span>
                            </div>

                            <button
                                onClick={logouthandler}
                                className=" px-5 py-2.5 text-base rounded-lg border border-red-300 text-red-500  transition flex items-center gap-2 hover:bg-red-600 hover:border-red-600 hover:text-white" >
                                <LogOut size={16} />
                            </button>

                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-base font-medium text-gray-700 hover:text-indigo-600"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2.5 text-base rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
