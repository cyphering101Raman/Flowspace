import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axiosInstance from '../utils/axiosInstace.js';

const EditorConsole = ({ selectedDoc, content, setContent }) => {
  const saveContent = async (updated) => {
    try {
      await axiosInstance.put(`/document/${selectedDoc._id}`, {
        content: updated,
      });
    } catch (err) {
      console.error("Error saving content", err);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {selectedDoc.title}
      </h1>

      <Editor
        apiKey="8by4dqrsol0dvc9botzrabqhzjv2fysg4wvzvjupsaw6t61y"
        value={content}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help'
        }}
        onEditorChange={(updated) => {
          setContent(updated);
          saveContent(updated); // auto-save
        }}
      />
    </div>
  );
};

export default EditorConsole;
