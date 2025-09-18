import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";

const App = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;