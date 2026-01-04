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
      <aside className="flex-shrink-0 w-56 border-r bg-white/80 backdrop-blur-xl p-4 overflow-y-auto min-w-[240px]">

        {/* Header */}
        <Link to="/document">
          <div className="mb-4 flex items-center gap-2 px-2">
            <Folder className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
          </div>
        </Link>

        {/* Tree */}
        <ul className="space-y-1">
          {documents.map((doc) => (
            <li key={doc._id}>

              {/* Folder */}
              <div className="group flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 transition">

                <div
                  onClick={() => toggleFolder(doc._id)}
                  onDoubleClick={() => {
                    setEditingFolderId(doc._id);
                    setNewFolderName(doc.title);
                  }}
                  className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                >
                  {openFolders[doc._id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}

                  <Folder className="w-4 h-4 text-gray-500" />

                  {editingFolderId === doc._id ? (
                    <input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renameFolder(doc._id);
                        if (e.key === "Escape") setEditingFolderId(null);
                      }}
                      className="w-full bg-white border border-gray-300 rounded px-2 py-0.5 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate text-sm font-medium text-gray-800">
                      {doc.title}
                    </span>
                  )}
                </div>

                {/* Folder actions */}
                {editingFolderId !== doc._id && (
                  <button
                    onClick={() => {
                      setEditingFolderId(doc._id);
                      setNewFolderName(doc.title);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition text-gray-700 hover:text-indigo-700"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>

              {/* Files */}
              {openFolders[doc._id] && (
                <ul className="mt-1 ml-6 space-y-1">
                  {(doc.children || []).map((file) => (
                    <li key={file._id} className="group flex items-center justify-between">

                      {editingFileId === file._id ? (
                        <input
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") renameFile(file._id, doc._id);
                            if (e.key === "Escape") setEditingFileId(null);
                          }}
                          className="w-[80%] bg-white border border-gray-300 rounded px-2 py-0.5 text-sm"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => {
                            setSelectedDoc(file);
                            navigate(`/document/${file._id}`);
                          }}
                          onDoubleClick={() => {
                            setEditingFileId(file._id);
                            setNewFileName(file.title);
                          }}
                            className={`flex-1 flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer text-sm truncate
                      ${selectedDoc?._id === file._id
                              ? "bg-indigo-100 text-indigo-700 font-medium"
                              : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                          <FileText className="w-4 h-4 text-gray-400" />
                          {file.title}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setEditingFileId(file._id);
                          setNewFileName(file.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-indigo-600"
                      >
                        <Pencil size={13} />
                      </button>
                    </li>
                  ))}

                  {/* New File */}
                  <li>
                    <button
                      onClick={() => createNewDocument(doc._id)}
                      className="mt-1 ml-2 flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition"
                    >
                      <Plus className="w-3 h-3" />
                      New file
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* New Root */}
        <button
          onClick={() => createNewDocument(null)}
          className="mt-6 flex items-center gap-2 px-2 text-sm text-gray-600 hover:text-indigo-600 transition"
        >
          <Plus className="w-4 h-4" />
          New document
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
