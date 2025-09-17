import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldUser, Github } from 'lucide-react';


import axiosInstance from "../utils/axiosInstace.js"

import { useDispatch } from "react-redux";
import { login } from "../features/authStore.js"

import { useAuth0 } from '@auth0/auth0-react';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset, setError } = useForm();

  const { loginWithPopup, user, getIdTokenClaims, isAuthenticated } = useAuth0();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupHandler = async (userData) => {
    console.log(userData);
    try {
      const res = await axiosInstance.post("/auth/signup", userData);
      console.log(res);

      const user = res.data;
      console.log(user);
      dispatch(login(user));
    } catch (error) {
      if (error.response && error.response.data?.message) {
        setError("confirmPassword", {
          type: "manual",
          message: error.response.data.message
        })
      } else {
        setError("confirmPassword", {
          type: "manual",
          message: "Server error. Try again later."
        });
      }
    }
  };

  const auth0Handler = async (provider) => {
    try {
      await loginWithPopup({ connection: provider, prompt: "select_account" })

      const claims = await getIdTokenClaims();
      if (!claims) throw new Error("Failed to get user info");

      const userData = {
        name: claims.name,
        email: claims.email,
        role: "viewer",
      };

      const res = await axiosInstance.post("/auth/signup", userData);
      dispatch(login(res.data));
      console.log("YOu are successfull signedup");
      
      navigate('/');

    } catch (err) {
      console.error(`${provider} login failed`, err);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Section - Company Name and Signup Form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Excellence Technologies</h1>
        </div>
        <div className="max-w-md w-full space-y-8">
          <p className="text-center text-gray-600">
            Shaping your ideas into reality.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Sign Up
            </h2>
            <form onSubmit={handleSubmit(signupHandler)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={20} />
                  Name
                </label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

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

              {/* Role Field */}
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <ShieldUser size={20} className="mr-2" />
                  Role
                </label>
                <select
                  {...register("role", { required: "Role is required" })}
                  className="w-full p-2 px-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="viewer"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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

              {/* Confirm Password Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock size={20} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watch('password') || 'Passwords do not match',
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
              >
                Sign Up
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
                Sign up with Google
              </button>

              <button
                type="button"
                onClick={() => auth0Handler("github")}
                className="w-full flex items-center justify-center gap-2 bg-[#24292F] border border-[#24292F] text-white py-3 px-4 rounded-md hover:bg-[#3A3F44] transition font-medium mt-4"
              >
                <Github size={20} />
                Sign up with GitHub
              </button>

              {/* Alternative Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section - Navigation Links and Image */}
      <div className="w-1/2 bg-gray-100 flex flex-col items-center p-8">

        <nav className="mb-8 flex space-x-6">
          <NavLink to="/" className="text-gray-700 hover:text-blue-600 p-2 rounded"
          >
            Home
          </NavLink>

          <NavLink to="/about" className="text-gray-700 hover:text-blue-600 p-2 rounded"
          >
            About
          </NavLink>

          <NavLink to="/blog" className="text-gray-700 hover:text-blue-600 p-2 rounded"
          >
            Blog
          </NavLink>

          <NavLink to="/pricing" className="text-gray-700 hover:text-blue-600 p-2 rounded"
          >
            Pricing
          </NavLink>
        </nav>

        {/* Icon and Text below links */}
        <div className="flex flex-col items-center text-center mt-6">
          <img src="./image2.jpg" alt="company_image"
            className="object-cover rounded-xl shadow-md mb-4"
          />
          <p className="text-lg font-semibold text-gray-900">
            Building Smarter Projects with Us
          </p>
        </div>

      </div>

    </div>
  );
}

export default Signup;