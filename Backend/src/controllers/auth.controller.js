import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js"

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/"
}

const signup = asyncHandler(async (req, res) => {

  const { name, email, role, password } = req.body;

  if (!name || !email || !role) throw new ApiError(400, "All Fields are required");

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    const token = jwt.sign({ _id: existedUser._id, role: existedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE_IN }
    );

    return res.status(200)
      .cookie("token", token, options)
      .json(new ApiResponse(200, existedUser, "User logged in successfully"));
  }

  let user;
  if (!password) user = await User.create({name, email, role})
  else user = await User.create({name, email, role, password})

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) throw new ApiError(500, "Failed to create user");

  const token = jwt.sign({ _id: user._id, role: role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })

  return res.status(201)
    .cookie("token", token, options)
    .json(new ApiResponse(201, createdUser, "User registered successfully"))

})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email) throw new ApiError(400, "Email required");

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(401, "Invalid credentials");

  if(!user.password) throw new ApiError(400, "This account was created via Social login.");

  if(!password) throw new ApiError(400, "Password is required");

  const isPasswordCorrect = await user.isPasswordValid(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const loggedinUser = await User.findById(user._id).select("-password");

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })

  return res.status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, loggedinUser, "Login Successful"))
})

const logout = asyncHandler(async (req, res) => {
  return res.status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, null, "Logout successfully"))
})

const checkAuth = asyncHandler(async (req, res) => {
  return res.status(200)
    .json(new ApiResponse(200, req.user, "User rehydrated successfully"));
})

export {
  signup,
  login,
  logout,
  checkAuth
}