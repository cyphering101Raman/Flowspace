import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

const Folder = mongoose.model("Folder", FolderSchema);


export default Folder;