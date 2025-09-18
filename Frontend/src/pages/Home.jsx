import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { User, LogIn, LogOut, FileText, BarChart2, Home as HomeIcon } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authStore";


// Sample chart data
const chartData = [
  { name: "Mon", edits: 30 },
  { name: "Tue", edits: 45 },
  { name: "Wed", edits: 20 },
  { name: "Thu", edits: 60 },
  { name: "Fri", edits: 80 },
  { name: "Sat", edits: 50 },
  { name: "Sun", edits: 70 },
];

const Home = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logouthandler = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Header */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl">
          Write. Share. Collaborate. <span className="text-indigo-600">Effortlessly.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Your all-in-one document workspace. Create, edit, and organize your thoughts with real-time collaboration,
          analytics, and powerful tools — just like Notion, but tailored for you.
        </p>
        <button
          onClick={() => {
            if (user) {
              navigate("/document"); // user is logged in
            } else {
              navigate("/login"); // not logged in
            }
          }}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </button>

        {/* Hero Image */}
        <div className="mt-12 w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80"
            alt="Document workspace preview"
            className="w-full object-cover"
          />
        </div>
      </main>

      {/* Analytics Section */}
      <section className="py-16 px-6 bg-white shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Workspace Insights</h2>
          <p className="mt-2 text-gray-600">
            Track edits, activity, and collaboration across your workspace in real time.
          </p>

          <div className="mt-10 w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="edits" stroke="#6366f1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Flowspace. All rights reserved.</p>
          <nav className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Home;
