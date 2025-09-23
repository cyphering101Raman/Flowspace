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

  const handleImageUpload = async (blobInfo) => {
    try {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      const cloudRes = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = cloudRes?.data?.url;
      if (!uploadedUrl) throw new Error("Upload failed: No URL returned from backend");

      const attachmentData = {
        name: blobInfo.filename(),
        url: uploadedUrl,
        type: blobInfo.blob().type,
        size: blobInfo.blob().size,
      };

      await axiosInstance.post(`/document/${selectedDoc._id}/attachments`, attachmentData);

      // Important: Resolve with { location } for TinyMCE image dialog
      return { location: uploadedUrl };
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
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
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'table',
            'help', 'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | ' +
            'image fileupload | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help',

          // Promise-based handler; must resolve with a URL string
          images_upload_handler: (blobInfo, progress) => handleImageUpload(blobInfo).then(r => r.location || r),
          automatic_uploads: true,
          file_picker_types: 'image file',
          images_file_types: 'jpeg,jpg,png,gif,webp',
          image_dimensions: true,
          image_uploadtab: true,

          paste_data_images: true,
          file_picker_callback: async function (callback, value, meta) {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');

              input.onchange = async function () {
                const file = this.files[0];
                const blobInfo = {
                  filename: () => file.name,
                  blob: () => file,
                };

                try {
                  const result = await handleImageUpload(blobInfo);
                  const url = result?.location || result;
                  callback(url, { alt: file.name || '' });
                } catch (e) {
                  alert(e?.message || 'Image upload failed');
                }
              };
              input.click();
            } else if (meta.filetype === 'file') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', '.pdf,.txt,.doc,.docx,.odt,.ods,.odp,.rtf,.zip,.csv,.xlsx,.xls,.ppt,.pptx');

              input.onchange = async function () {
                const file = this.files[0];
                const blobInfo = {
                  filename: () => file.name,
                  blob: () => file,
                };

                try {
                  const result = await handleImageUpload(blobInfo);
                  const url = result?.location || result;
                  const originalName = file.name || 'download';
                  const originalExt = (originalName.split('.').pop() || '').toLowerCase();
                  let customName = window.prompt('Download filename (optional):', originalName) || originalName;
                  if (!customName.toLowerCase().endsWith('.' + originalExt) && originalExt) {
                    customName = `${customName}.${originalExt}`;
                  }
                  const encodedName = encodeURIComponent(customName);
                  const downloadUrl = url.replace('/upload/', `/upload/fl_attachment:${encodedName}/`);
                  const linkHtml = `<a href="${url}" target="_blank" rel="noopener">${originalName}</a> (<a href="${downloadUrl}">Download</a>)`;
                  if (window.tinymce && window.tinymce.activeEditor) {
                    window.tinymce.activeEditor.insertContent(linkHtml);
                  } else {
                    callback(url, { text: originalName });
                  }
                } catch (e) {
                  alert(e?.message || 'File upload failed');
                }
              };
              input.click();
            }
          },
          setup: (editor) => {
            editor.ui.registry.addButton('fileupload', {
              text: 'Upload file',
              tooltip: 'Upload and insert file link',
              onAction: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.txt,.doc,.docx,.odt,.ods,.odp,.rtf,.zip,.csv,.xlsx,.xls,.ppt,.pptx';
                input.onchange = async function () {
                  const file = this.files[0];
                  if (!file) return;
                  const blobInfo = { filename: () => file.name, blob: () => file };
                  try {
                    const result = await handleImageUpload(blobInfo);
                    const url = result?.location || result;
                    const originalName = file.name || 'download';
                    const originalExt = (originalName.split('.').pop() || '').toLowerCase();
                    let customName = window.prompt('Download filename (optional):', originalName) || originalName;
                    if (!customName.toLowerCase().endsWith('.' + originalExt) && originalExt) {
                      customName = `${customName}.${originalExt}`;
                    }
                    const encodedName = encodeURIComponent(customName);
                    const downloadUrl = url.replace('/upload/', `/upload/fl_attachment:${encodedName}/`);
                    const linkHtml = `<a href="${url}" target="_blank" rel="noopener">${originalName}</a> (<a href="${downloadUrl}">Download</a>)`;
                    editor.insertContent(linkHtml);
                  } catch (e) {
                    alert(e?.message || 'File upload failed');
                  }
                };
                input.click();
              }
            });
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
