import { Router } from "express";

import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument
} from '../controllers/document.controller.js';

import protectedRoute from '../middleware/user.middleware.js';


const route = Router()
route.use(protectedRoute);

route.get('/', getAllDocuments);
route.get('/:id', getDocumentById);
route.post('/', createDocument);
route.put('/:id', updateDocument);
route.delete('/:id', deleteDocument);

export default route;