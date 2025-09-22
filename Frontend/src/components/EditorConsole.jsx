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

  // ✅ Image upload handler
  const handleImageUpload = async (blobInfo, success, failure) => {
    try {
      // 1️⃣ Upload image to Cloudinary via backend
      const formData = new FormData();
      formData.append("image", blobInfo.blob(), blobInfo.filename());

      const cloudRes = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = cloudRes.data.url;
      if (!uploadedUrl) return failure("Upload failed: No URL returned from backend");

      console.log("Cloudinary URL:", uploadedUrl);

      // 2️⃣ Send URL to backend to store as attachment
      const attachmentData = {
        name: blobInfo.filename(),
        url: uploadedUrl,
        type: blobInfo.blob().type,
        size: blobInfo.blob().size,
      };

      console.log("Sending attachment to backend:", attachmentData);

      await axiosInstance.post(`/document/${selectedDoc._id}/attachments`,
        attachmentData
      );

      // 3️⃣ Send URL to TinyMCE to display image in editor
      success(uploadedUrl);

    } catch (err) {
      console.error("Image upload error:", err);
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
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'table', 'paste',
            'help', 'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | ' +
            'image | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help',

          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image',

          // Remove drag/drop and base64 paste handling
          paste_data_images: false,
          file_picker_callback: function (callback, value, meta) {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.onchange = async function () {
                const file = this.files[0];
                const blobInfo = {
                  filename: () => file.name,
                  blob: () => file
                };

                await handleImageUpload(
                  blobInfo,
                  (url) => {
                    callback(url, { alt: file.name }); // insert only the uploaded Cloudinary URL
                  },
                  (errMsg = "Image upload failed") => {
                    alert(errMsg);
                  }
                );
              };
              input.click();
            }
          },
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
