import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PenLine, Lock, CalendarDays, ArrowRight, } from "lucide-react";

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">

            <main className="flex-1">
                <section className="min-h-[70vh] flex justify-center items-center max-w-7xl mx-auto px-8 pt-24 pb-20">
                    <div className="flex flex-col items-center text-center max-w-3xl">

                        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            Write. Share. Collaborate.
                        </h2>

                        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                            A personal workspace for thoughts, notes, and daily journals.
                            <br />
                            Minimal, focused, and built to help you think better.
                        </p>

                        <div className="mt-10 flex items-center gap-4">
                            <button
                                onClick={() => navigate(user ? "/document" : "/signup")}
                                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                Start Writing <ArrowRight size={16} />
                            </button>

                            <span className="text-sm text-gray-500">
                                No clutter. No noise.
                            </span>
                        </div>

                    </div>
                </section>

                {/* Features */}
                <section className="max-w-7xl mx-auto px-8 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Feature
                            icon={<PenLine />}
                            title="Distraction-free writing"
                            desc="A clean editor that keeps the focus on your thoughts."
                        />
                        <Feature
                            icon={<CalendarDays />}
                            title="Daily journaling"
                            desc="Capture ideas, reflections, and moments—day by day."
                        />
                        <Feature
                            icon={<Lock />}
                            title="Private by default"
                            desc="Your notes stay yours. No feeds. No public noise."
                        />
                    </div>
                </section>

                {/* Workspace Preview (no image, intentional) */}
                <section className="max-w-5xl mx-auto px-8 pb-32">
                    <div className="rounded-2xl bg-white shadow-xl border overflow-hidden">
                        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
                            Today’s note
                        </div>
                        <div className="p-10 text-gray-400 italic">
                            “Writing is not about productivity.
                            It’s about clarity.”
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between text-sm">
                    <p>© {new Date().getFullYear()} Flowspace</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:text-white">
                            Terms
                        </Link>
                        <Link to="/contact" className="hover:text-white">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const Feature = ({ icon, title, desc }) => (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            {icon}
        </div>
        <h3 className="mt-4 font-semibold text-lg">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
);

export default Home;
