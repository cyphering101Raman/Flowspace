import { Router } from "express";

import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/user.middleware.js";

const route = Router()

route.post("/signup", signup)
route.post("/login", login)
route.post("/logout", logout)

route.get("/check", protectedRoute, checkAuth)

export default route;