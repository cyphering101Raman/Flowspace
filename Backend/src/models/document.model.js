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
        name: { type: String },
        url: { type: String, required: true },
        type: { type: String },
        size: { type: Number },
      }
    ],
  },
  { timestamps: true }
);

// Indexes for fast queries
DocumentSchema.index({ userId: 1 });
DocumentSchema.index({ userId: 1, parentDocument: 1 });

const Document = mongoose.model("Document", DocumentSchema);
export default Document;
