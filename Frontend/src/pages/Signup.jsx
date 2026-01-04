import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldUser, Github, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

import axiosInstance from "../utils/axiosInstace.js"

import { useDispatch } from "react-redux";
import { login } from "../features/authStore.js"

import { useAuth0 } from '@auth0/auth0-react';

const Signup = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset, setError } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isAuth0Loading, setIsAuth0Loading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { loginWithPopup, user, getIdTokenClaims, isAuthenticated } = useAuth0();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signupHandler = async (userData) => {
        // console.log(userData);
        setIsLoading(true);

        try {
            const res = await axiosInstance.post("/auth/signup", userData);
            // console.log(res);

            const user = res.data;
            // console.log(user);
            dispatch(login(user.data));
            toast.success("Account created successfully! Welcome to Flow Space!");
            navigate("/");
        } catch (error) {
            if (error.response && error.response.data?.message) {
                setError("confirmPassword", {
                    type: "manual",
                    message: error.response.data.message
                });
                toast.error(error.response.data.message);
            } else {
                setError("confirmPassword", {
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
            // console.log(res.data.data);

            console.log("You are successfull signed-up");
            toast.success(`Successfully signed up with ${provider}! Welcome to Flow Space!`);

            navigate('/');

        } catch (err) {
            console.error(`${provider} login failed`, err);
            toast.error(`Failed to sign up with ${provider}. Please try again.`);
        } finally {
            setIsAuth0Loading(false);
        }
    };

    return (
        <div style={{
            backgroundImage: "url('/loginSidePanel.webp')",
            backgroundSize: "cover",
            backgroundPosition: "right",
        }} className="min-h-screen flex bg-gray-50">

            {/* Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md space-y-2">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
                        <p className="mt-2 text-gray-800 font-medium">
                            Join Flow Space in less than a minute
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        <form onSubmit={handleSubmit(signupHandler)} className="space-y-5">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    {...register("name")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Your name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    {...register("email")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    {...register("role")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    defaultValue="viewer"
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
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
                                        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Minimum 6 characters
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register("confirmPassword")}
                                        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {isLoading ? "Creating account..." : "Create account"}
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
                            <button className="w-full border border-gray-200 py-3 rounded-lg flex items-center justify-center gap-3 hover:shadow-sm">
                                <img src="./googleTrasn.png" className="w-5 h-5" />
                                Continue with Google
                            </button>
                            <button className="w-full bg-gray-900 text-white py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-800">
                                <Github size={18} />
                                Continue with GitHub
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-md bg-white/20 text-gray-900 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-indigo-700">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="hidden lg:flex w-1/2 min-h-screen px-24 pt-24 justify-end items-start">
                <div className="p-8 rounded-2xl max-w-md text-right space-y-4">
                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        Start your flow.
                    </h2>
                    <p className="text-gray-900 text-lg">
                        Create an account to write, think, and build in a calm,
                        distraction-free workspace.
                    </p>
                </div>
            </div>

        </div>
    );

}

export default Signup;