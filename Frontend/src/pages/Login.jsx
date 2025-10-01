import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Mail, Lock, Github } from 'lucide-react';
import { toast } from 'react-toastify';

import axiosInstance from "../utils/axiosInstace.js"

import { useDispatch } from "react-redux";
import { login } from "../features/authStore.js"

import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();

  const { loginWithPopup, getUser, getIdTokenClaims, isAuthenticated } = useAuth0();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (userData) => {
    console.log(userData);

    try {
      const res = await axiosInstance.post("/auth/login", userData);
      const user = res.data;
      console.log("user Data from logn: ", user);

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
    }
  };

  const auth0Handler = async (provider) => {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left Section - Image */}
      <div className="w-1/2 bg-gray-100 flex flex-col items-center p-8 space-y-6">

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <NavLink to="/" className="text-gray-700 hover:text-blue-600 p-2 rounded">
            Home
          </NavLink>
          <NavLink to="/about" className="text-gray-700 hover:text-blue-600 p-2 rounded">
            About
          </NavLink>
          <NavLink to="/blog" className="text-gray-700 hover:text-blue-600 p-2 rounded">
            Blog
          </NavLink>
          <NavLink to="/pricing" className="text-gray-700 hover:text-blue-600 p-2 rounded">
            Pricing
          </NavLink>
        </nav>

        {/* Image */}
        <img
          src="./login.gif"
          alt="company_image"
          className="object-cover rounded-xl shadow-md mb-6"
        />

        {/* Tagline */}
        <p className="text-lg font-semibold text-gray-900 text-center mb-6">
          Building Smarter Projects with Us
        </p>

      </div>


      {/* Right Section - Login Form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Flow Space</h1>
        </div>
        <div className="max-w-md w-full space-y-8">
          <p className="text-center text-gray-600">
            Shaping your ideas into reality.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Log In
            </h2>
            <form onSubmit={handleSubmit(loginHandler)} className="space-y-4">

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail size={20} />
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={20} />
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
              >
                Log In
              </button>

              {/* Separator */}
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <button
                type="button"
                onClick={() => auth0Handler("google-oauth2")}
                className="w-full flex items-center justify-center gap-2 bg-[#DB4437] border border-[#DB4437] text-white py-3 px-4 rounded-md hover:bg-[#C33D2E] transition font-medium mt-4"
              >
                <img src="./googleTrasn.png" alt="Google" className="w-5 h-5" />
                Log in with Google
              </button>

              <button
                type="button"
                onClick={() => auth0Handler("github")}
                className="w-full flex items-center justify-center gap-2 bg-[#24292F] border border-[#24292F] text-white py-3 px-4 rounded-md hover:bg-[#3A3F44] transition font-medium mt-4"
              >
                <Github size={20} />
                Log in with GitHub
              </button>

              {/* Navigation Links */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                    Sign up
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Back to{' '}
                  <Link to="/" className="font-semibold text-blue-600 hover:underline">
                    Home
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
