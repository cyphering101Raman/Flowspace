import Document from "../models/document.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js"

const getAllDocuments = asyncHandler(async (res, res) => {
  const documents = await Document.find();
  return res.status(200).json(new ApiResponse(200, documents, "All Document fetched"));
});

const getDocumentById = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) throw new ApiError(404, "Document not found");
  return res.status(200).json(new ApiResponse(200, doc));
});

const createDocument = asyncHandler(async (req, res) => {
  const { title, folder, content } = req.body;
  if (!title || !folder) throw new ApiError(400, "Title and folder are required");

  const newDoc = await Document.create({ title, folder, content: content || " " });
  return res.status(201).json(new ApiResponse(201, newDoc, "Document created successfully"));
});

const updateDocument = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const updatedDoc = await Document.findByIdAndUpdate(
    req.param.id,
    { content },
    { new: true }
  );

  if (!updatedDoc) throw new ApiError(404, "Document not found");
  return res.status(200).json(new ApiResponse(200, updatedDoc, "Document updated successfully"));
});

const deleteDocument = asyncHandler(async (req, res) => {
  const deletedDoc = await Document.findByIdAndDelete(req.params.id);
  if (!deletedDoc) throw new ApiError(404, "Document not found");
  return res.status(200).json(new ApiResponse(200, null, "Document deleted successfully"));
});

export{
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument
}