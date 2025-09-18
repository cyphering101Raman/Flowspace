import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
export default Document;