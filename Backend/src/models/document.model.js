import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Document = mongoose.model('Document', DocumentSchema);

export default Document;