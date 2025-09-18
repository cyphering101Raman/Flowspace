import React from 'react'
import { Editor } from '@tinymce/tinymce-react';

const EditorConsole = ({ selectedDoc, content, setContent }) => {
  console.log("doc came n: ", selectedDoc);
  
  return (
    <div className="max-w-3xl w-full mx-auto">
      {/* Use file name, not whole object */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {selectedDoc.name}
      </h1>

      <Editor
        apiKey="8by4dqrsol0dvc9botzrabqhzjv2fysg4wvzvjupsaw6t61y"
        initialValue={`Start writing your content for ${selectedDoc.name}...`}
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
        onEditorChange={(content) => {
          console.log('Content updated:', content);
          setContent(content); // update parent state
        }}
      />
    </div>
  );
};

export default EditorConsole;
