import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gradient-to-r from-purple-400 to-purple-600">
      
      {/* Main Heading */}
      <h1 className="text-4xl font-bold text-white text-center">
        Excellence Technologies
      </h1>

      {/* Subheading / Tagline */}
      <p className="text-lg text-gray-100 text-center max-w-md">
        Shaping your ideas into reality. Join us to build smarter projects together.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link to="/signup">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
            Log In
          </button>
        </Link>
      </div>
      
    </div>
  );
};

export default Home;
