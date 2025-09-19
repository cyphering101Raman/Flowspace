import Document from "../models/document.model.js";
import { ApiError, ApiResponse, asyncHandler} from "../utils/index.js";

// Create a new document
export const createDocument = asyncHandler(async (req, res) => {
  const { title, parentDocument, content, coverImage, isPublished } = req.body;

  if (!title) throw new ApiError(400, "Title is required");

  const doc = await Document.create({
    title,
    userId: req.user._id,
    parentDocument: parentDocument || null,
    content: content || "",
    coverImage,
    isPublished: isPublished || false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, doc, "Document created successfully"));
});

// Get all root documents for a user
export const getRootDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({
    userId: req.user._id,
    parentDocument: null,
    isArchived: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, docs, "Root documents fetched"));
});

// Get all children of a folder
export const getChildren = asyncHandler(async (req, res) => {
  const { parentId } = req.params;

  const docs = await Document.find({
    userId: req.user._id,
    parentDocument: parentId,
    isArchived: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, docs, "Children documents fetched"));
});

// Get a single document by ID
export const getDocumentById = asyncHandler(async (req, res) => {
  const doc = await Document.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!doc) throw new ApiError(404, "Document not found");

  return res
    .status(200)
    .json(new ApiResponse(200, doc, "Document fetched successfully"));
});

// Update document
export const updateDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doc = await Document.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $set: req.body },
    { new: true }
  );

  if (!doc) throw new ApiError(404, "Document not found");

  return res
    .status(200)
    .json(new ApiResponse(200, doc, "Document updated successfully"));
});

// Archive (soft delete)
export const archiveDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doc = await Document.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $set: { isArchived: true } },
    { new: true }
  );

  if (!doc) throw new ApiError(404, "Document not found");

  return res
    .status(200)
    .json(new ApiResponse(200, doc, "Document archived"));
});

// Add attachment to a document
export const addAttachment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, url, type, size } = req.body;

  if (!url) throw new ApiError(400, "File URL is required");

  const doc = await Document.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $push: { attachments: { name, url, type, size } } },
    { new: true }
  );

  if (!doc) throw new ApiError(404, "Document not found");

  return res
    .status(200)
    .json(new ApiResponse(200, doc, "Attachment added successfully"));
});
