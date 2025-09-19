import { Router } from "express";
import {
  createDocument,
  getRootDocuments,
  getChildren,
  getDocumentById,
  updateDocument,
  archiveDocument,
  addAttachment,
} from "../controllers/document.controller.js";

import protectedRoute from "../middleware/user.middleware.js";

const router = Router();
router.use(protectedRoute);

router.post("/", createDocument);
router.get("/root", getRootDocuments);
router.get("/:parentId/children", getChildren);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", archiveDocument);
router.post("/:id/attachments", addAttachment);

export default router;
