import React from 'react';
import { Outlet } from 'react-router-dom';

const App = ({ children }) => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default App;