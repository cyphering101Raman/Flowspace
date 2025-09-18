import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { User, LogIn, LogOut, FileText, BarChart2, Home as HomeIcon } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authStore";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logouthandler = () => {
    dispatch(logout());
  };
  return (
    <header className="w-full shadow bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <FileText className="w-7 h-7" /> Flowspace
        </Link>

        {/* Navigation */}
        {/* Navigation */}
        <nav className="hidden md:flex gap-6 font-medium">
          <NavLink to="/" className="flex items-center gap-1 hover:text-indigo-600">
            <HomeIcon size={18} /> Home
          </NavLink>

          <div
            onClick={() => {
              if (user) {
                navigate("/document");
              } else {
                navigate("/login");
              }
            }}
            className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
          >
            <FileText size={18} /> Documents
          </div>

          <NavLink to="/analytics" className="flex items-center gap-1 hover:text-indigo-600">
            <BarChart2 size={18} /> Analytics
          </NavLink>
        </nav>


        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <User className="w-5 h-5" /> {user.name}
              </span>
              <button
                onClick={logouthandler}
                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              > Login </Link>

              <Link
                to="/signup"
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              > Signup </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar