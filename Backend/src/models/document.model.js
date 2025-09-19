import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    parentDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },

    content: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    // File / Media attachments
    attachments: [
      {
        name: String,
        url: String,    // S3/MinIO signed URL or public URL
        type: String,
        size: Number,   // in bytes
      },
    ],
  },
  { timestamps: true }
);

// Indexes for fast queries
DocumentSchema.index({ userId: 1 });
DocumentSchema.index({ userId: 1, parentDocument: 1 });

const Document = mongoose.model("Document", DocumentSchema);
export default Document;
