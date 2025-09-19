import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axiosInstance from '../utils/axiosInstace.js';
import { useNavigate } from "react-router-dom";

const EditorConsole = ({ selectedDoc, content, setContent }) => {
  const navigate = useNavigate();

  const saveContent = async (updated) => {
    try {
      await axiosInstance.put(`/document/${selectedDoc._id}`, { content: updated });
    } catch (err) {
      console.error("Error saving content", err);
    }
  };

  const deleteDocument = async () => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axiosInstance.delete(`/document/${selectedDoc._id}`);
      navigate("/document");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting document", err);
    }
  };

  // ✅ Image upload handler (drag-drop, copy-paste, or toolbar)
  const handleImageUpload = async (blobInfo, success, failure) => {
    try {
      const sigRes = await axiosInstance.post("/upload/signature");
      const sigData = sigRes.data;

      const formData = new FormData();
      formData.append("file", blobInfo.blob());
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const uploadRes = await axiosInstance.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      success(uploadRes.data.secure_url);
    } catch (err) {
      failure("Image upload failed: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{selectedDoc.title}</h1>
        <button
          onClick={deleteDocument}
          className="text-red-600 border border-red-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-colors">
          Delete
        </button>
      </div>

      <Editor
        apiKey="8by4dqrsol0dvc9botzrabqhzjv2fysg4wvzvjupsaw6t61y"
        value={content}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help | image',
          images_upload_handler: handleImageUpload,
          paste_data_images: true, // allows copy-paste images
          automatic_uploads: true,
        }}
        onEditorChange={(updated) => {
          setContent(updated);
          saveContent(updated);
        }}
      />
    </div>
  );
};

export default EditorConsole;
