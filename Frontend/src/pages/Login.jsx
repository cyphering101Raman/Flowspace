import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Mail, Lock, Github, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

import axiosInstance from "../utils/axiosInstace.js"

import { useDispatch } from "react-redux";
import { login } from "../features/authStore.js"

import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isAuth0Loading, setIsAuth0Loading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { loginWithPopup, getUser, getIdTokenClaims, isAuthenticated } = useAuth0();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginHandler = async (userData) => {
        // console.log(userData);
        setIsLoading(true);

        try {
            const res = await axiosInstance.post("/auth/login", userData);
            const user = res.data;
            // console.log("user Data from logn: ", user);

            dispatch(login(user.data));
            toast.success("Login successful! Welcome back!");
            navigate("/");

        } catch (error) {
            if (error.response && error.response.data?.message) {
                const message = error.response.data.message;

                if (message.includes("Email")) {
                    setError("email", { type: "manual", message });
                    toast.error(message);
                }
                else if (message.includes("Password") || message.includes("Invalid credentials")) {
                    setError("password", { type: "manual", message });
                    toast.error(message);
                }
            } else {
                setError("password", {
                    type: "manual",
                    message: "Server error. Try again later."
                });
                toast.error("Server error. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const auth0Handler = async (provider) => {
        setIsAuth0Loading(true);
        try {
            await loginWithPopup({ connection: provider })

            const claims = await getIdTokenClaims();
            if (!claims) throw new Error("Failed to get user info");

            const userData = {
                name: claims.name,
                email: claims.email,
                role: "viewer",
            };

            const res = await axiosInstance.post("/auth/signup", userData);
            dispatch(login(res.data.data));
            console.log("You are successfull logged-in");
            toast.success(`Successfully logged in with ${provider}!`);

            navigate('/');

        } catch (err) {
            console.error(`${provider} login failed`, err);
            toast.error(`Failed to login with ${provider}. Please try again.`);
        } finally {
            setIsAuth0Loading(false);
        }
    };

    return (
        <div style={{
            backgroundImage: "url('/loginSidePanel.webp')",
            backgroundSize: "cover",
            backgroundPosition: "left top",
        }} className="min-h-screen flex bg-gray-50">

            {/* Left Section */}
            <div className="pt-44 hidden lg:flex w-1/2 min-h-screen px-12 py-10 flex-col items-center text-center bg-cover bg-center relative"
            >
                {/* Content */}
                <div className="relative z-10 space-y-6 max-w-md bg-white/10  p-6 rounded-xl">

                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        A calm space<br />to write & think.
                    </h2>
                    <p className="text-gray-800 text-lg">
                        Capture thoughts, journals, and ideas <br /> in a focused workspace designed
                        for clarity.
                    </p>

                </div>
            </div>

            {/* Right Section */}
            <div className="mb-10 w-full lg:w-1/2 flex items-start justify-center px-6 pt-20">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Log in to continue writing
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

                        <form onSubmit={handleSubmit(loginHandler)} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="you@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {isLoading ? "Logging in..." : "Log in"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <span className="flex-grow h-px bg-gray-200" />
                            <span className="text-sm text-gray-400">OR</span>
                            <span className="flex-grow h-px bg-gray-200" />
                        </div>

                        {/* Social */}
                        <div className="space-y-3">
                            <button
                                onClick={() => auth0Handler("google-oauth2")}
                                disabled={isAuth0Loading}
                                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
                            >
                                <img src="./googleTrasn.png" className="w-5 h-5" />
                                Continue with Google
                            </button>

                            <button
                                onClick={() => auth0Handler("github")}
                                disabled={isAuth0Loading}
                                className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition"
                            >
                                <Github size={18} />
                                Continue with GitHub
                            </button>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );

}

export default Login;
