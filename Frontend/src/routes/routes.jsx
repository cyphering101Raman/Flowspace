import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import App from "../App.jsx";
import Signup from "../pages/Signup.jsx"
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Document from "../pages/Document.jsx";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />}></Route>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/document" element={<Document />}>
        <Route path=":id" element={<Document />} />
      </Route>
    </Route>
  )
)

export default routes