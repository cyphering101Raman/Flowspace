import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink } from 'react-router-dom';
import { Mail, Lock, Bike } from 'lucide-react';

function Login() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    reset();
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
          <h1 className="text-3xl font-bold text-blue-600">Excellence Technologies</h1>
        </div>
        <div className="max-w-md w-full space-y-8">
          <p className="text-center text-gray-600">
            Shaping your ideas into reality.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Log In
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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
