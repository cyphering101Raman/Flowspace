import React, { useState, useEffect } from "react";
import { Folder, FileText, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Pencil } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { useParams, useNavigate, Link } from "react-router-dom";

import EditorConsole from "../components/EditorConsole.jsx";
import axiosInstance from "../utils/axiosInstace.js"

const Document = () => {
  const [openFolders, setOpenFolders] = useState({});       // keep track of which folder has opened

  const [selectedDoc, setSelectedDoc] = useState(null);      // keep track of which doc is selected
  const [docContent, setDocContent] = useState('');         // keep track of content written in the document

  const [documents, setDocuments] = useState([]);          // ------ keep track of document in the db

  const [editingFileId, setEditingFileId] = useState(null); //--------keep track of which file is editing
  const [newFileName, setNewFileName] = useState("");      // ---------- set new file name

  const [editingFolderId, setEditingFolderId] = useState(null);   //--------keep track of which folder is editing
  const [newFolderName, setNewFolderName] = useState("");    // ---------- set new flder name

  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch root folders   --  just fetch the folder only not the files.
  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get("/document/root");

      setDocuments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching docs", err);
    }
  };

  // ✅ Create new document   -- helps in creating new document folder and file
  const createNewDocument = async (parentId = null) => {
    try {
      const res = await axiosInstance.post("/document", {
        title: "Untitled Document",
        parentDocument: parentId, // send parentDocument to backend
      });

      if (parentId) {
        // Add new file to that folder in state
        setDocuments((prev) =>
          prev.map((doc) =>
            doc._id === parentId
              ? { ...doc, children: [...(doc.children || []), res.data.data] }
              : doc
          )
        );
      } else {
        // New root folder
        setDocuments((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error("Error creating doc", err);
    }
  };

  const fetchChildren = async (parentId) => {
    try {
      const res = await axiosInstance.get(`/document/${parentId}/children`);
      // update the documents state with the fetched children
      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === parentId ? { ...doc, children: res.data.data } : doc
        )
      );
    } catch (err) {
      console.error("Error fetching children", err);
    }
  };

  const renameFile = async (fileId, parentId) => {
    try {
      const res = await axiosInstance.put(`/document/${fileId}`, {
        title: newFileName,
      });

      // Update state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === parentId
            ? {
              ...doc,
              children: (doc.children || []).map((f) =>
                f._id === fileId ? { ...f, title: res.data.data.title } : f
              ),
            }
            : doc
        )
      );

      // ✅ Update selectedDoc if it's the currently open file
      if (selectedDoc?._id === fileId) {
        setSelectedDoc((prev) => ({ ...prev, title: res.data.data.title }));
      }

      setEditingFileId(null);
    } catch (err) {
      console.error("Error renaming file", err);
    }
  };

  const renameFolder = async (folderId) => {
    try {
      const res = await axiosInstance.put(`/document/${folderId}`, {
        title: newFolderName,
      });

      // Update documents state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === folderId ? { ...doc, title: res.data.data.title } : doc
        )
      );

      setEditingFolderId(null);
    } catch (err) {
      console.error("Error renaming folder", err);
    }
  };

  const toggleFolder = async (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));

    const folder = documents.find((doc) => doc._id === id);
    if (folder && !folder.children) {
      await fetchChildren(id);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!id) setSelectedDoc(null);
    else {
      // fetch single document content
      axiosInstance.get(`/document/${id}`)
        .then((res) => {
          setSelectedDoc(res.data.data);
          setDocContent(res.data.data.content);
        })
        .catch(console.error);
    }
  }, [id])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex-shrink-0 w-64 max-w-full border-r bg-white shadow-lg p-4 overflow-y-auto min-w-[220px]">
        <Link to="/document">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-600" /> Documents
          </h2>
        </Link>

        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc._id}>
              {/* Folder Header */}
              {/* Folder Header */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => toggleFolder(doc._id)}
                  onDoubleClick={() => {   // 👈 double click triggers edit
                    setEditingFolderId(doc._id);
                    setNewFolderName(doc.title);
                  }}
                  className="flex items-center gap-2 cursor-pointer select-none flex-1 hover:text-indigo-600"
                >
                  {editingFolderId === doc._id ? (
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {   // 👈 enter = save, esc = cancel
                        if (e.key === "Enter") renameFolder(doc._id);
                        if (e.key === "Escape") setEditingFolderId(null);
                      }}
                      className="border border-gray-300 rounded px-2 py-0.5 w-full"
                      autoFocus
                    />
                  ) : (
                    <>
                      {openFolders[doc._id] ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <Folder className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold truncate">{doc.title}</span>
                    </>
                  )}
                </div>

                {/* Folder Edit Buttons */}
                {editingFolderId === doc._id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingFolderId(null)}
                      className="text-red-600 text-sm px-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingFolderId(doc._id);
                      setNewFolderName(doc.title);
                    }}
                    className="text-indigo-600 text-sm hover:underline px-1"
                  >
                    <Pencil size={15} />
                  </button>
                )}
              </div>


              {/* Folder Children */}
              {openFolders[doc._id] && (
                <ul className="ml-6 mt-2 space-y-1">
                  {(doc.children || []).map((file) => (
                    <li key={file._id} className="flex items-center justify-between gap-2">
                      {editingFileId === file._id ? (
                        <>
                          <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") renameFile(file._id, doc._id);
                              if (e.key === "Escape") setEditingFileId(null);
                            }}
                            className="border border-gray-300 rounded px-2 py-0.5 w-full"
                            autoFocus
                          />
                          <button
                            onClick={() => setEditingFileId(null)}
                            className="text-red-600 text-sm px-1"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() => {
                              setSelectedDoc(file);
                              navigate(`/document/${file._id}`);
                            }}
                            onDoubleClick={() => {
                              setEditingFileId(file._id);
                              setNewFileName(file.title);
                            }}
                            className={`flex-1 flex items-center gap-2 px-2 py-1 rounded truncate ${selectedDoc?._id === file._id
                              ? "bg-indigo-100 text-indigo-700 font-medium"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            <FileText className="w-4 h-4 text-gray-500" />
                            {file.title}
                          </div>
                          <button
                            onClick={() => {
                              setEditingFileId(file._id);
                              setNewFileName(file.title);
                            }}
                            className="text-indigo-600 text-sm hover:underline px-1"
                          >
                            <Pencil size={15} />
                          </button>
                        </>
                      )}
                    </li>
                  ))}

                  {/* Add New File */}
                  <li>
                    <button
                      onClick={() => createNewDocument(doc._id)}
                      className="flex items-center gap-1 text-indigo-600 text-sm hover:underline mt-1"
                    >
                      <Plus className="w-3 h-3" /> New File
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Add New Root Document */}
        <button
          onClick={() => createNewDocument(null)}
          className="mt-6 flex items-center gap-2 text-indigo-600 font-medium hover:underline"
        >
          <Plus className="w-4 h-4" /> New Document
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 min-w-0 flex flex-col overflow-auto">
        {selectedDoc ? (
          <EditorConsole
            selectedDoc={selectedDoc}
            content={docContent}
            setContent={setDocContent}
          />
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-start pt-20 text-gray-500 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/docImageNew.jpg')",
            }}
          >
            {/* <FileText className="w-16 h-16 mb-4 text-gray-400" /> */}
            <p className="pt-10 font-bold text-xl text-black">
              Select a file from the sidebar to begin editing.
            </p>
          </div>

        )}
      </main>
    </div>

  );

};

export default Document;
