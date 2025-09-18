import { Router } from "express";

import Folder from "../models/folder.model.js";

import protectedRoute from '../middleware/authCheck.js';


const route = Router()
route.use(protectedRoute);

route.get('/folder', getAllDocuments);

export default route;