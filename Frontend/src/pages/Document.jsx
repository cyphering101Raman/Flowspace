import React, { useState, useEffect } from "react";
import { Folder, FileText, Plus, ChevronDown, ChevronRight } from "lucide-react";

import { v4 as uuidv4 } from 'uuid';

import { useParams, useNavigate, Link } from "react-router-dom";

import EditorConsole from "../components/EditorConsole.jsx";

const documents = [
  {
    id: 1,
    folder: "Projects",
    files: [
      { id: uuidv4(), name: "Project Plan" },
      { id: uuidv4(), name: "Wireframes" },
      { id: uuidv4(), name: "API Notes" },
    ],
  },
  {
    id: 2,
    folder: "Personal",
    files: [
      { id: uuidv4(), name: "Journal" },
      { id: uuidv4(), name: "Ideas" },
      { id: uuidv4(), name: "Todo List" },
    ],
  },
  {
    id: 3,
    folder: "Work",
    files: [
      { id: uuidv4(), name: "Meeting Note" },
      { id: uuidv4(), name: "Quaterly Report" },
      { id: uuidv4(), name: "Roadmap" },
    ],
  },
];

const Document = () => {
  const [openFolders, setOpenFolders] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  const createfiles = async () => {
    const res = await axiosInstance.post(`/document`, document)
  }

  const toggleFolder = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (!id) setSelectedDoc(null);

  }, [id])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/3 max-w-sm border-r bg-white shadow-lg p-4 overflow-y-auto">
        <Link to='/document'>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-600" /> Documents
          </h2>
        </Link>
        <ul className="space-y-4">
          {documents.map((group) => (
            <li key={group.id}>
              {/* Folder header */}
              <div
                onClick={() => toggleFolder(group.id)}
                className="flex items-center gap-2 cursor-pointer select-none hover:text-indigo-600"
              >
                {openFolders[group.id] ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <Folder className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">{group.folder}</span>
              </div>

              {/* Files inside folder */}
              {openFolders[group.id] && (
                <ul className="ml-6 mt-2 space-y-1">
                  {group.files.map((file) => (
                    <li
                      key={file.id}
                      onClick={() => {
                        console.log("File Selected: ", file);
                        setSelectedDoc(file);
                        navigate(`/document/${file.id}`);
                      }}
                      className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${selectedDoc?.id === file
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      <FileText className="w-4 h-4" /> {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* New Doc Button */}
        <button className="mt-6 flex items-center gap-2 text-indigo-600 font-medium hover:underline">
          <Plus className="w-4 h-4" /> New Document
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 flex items-center justify-center">
        {selectedDoc ? (
          <EditorConsole
            selectedDoc={selectedDoc}
            content={docContent}
            setContent={setDocContent}
          />
        ) : (
          <div className="text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Select a file from the sidebar to begin editing.</p>
          </div>
        )}
      </main>

    </div >
  );
};

export default Document;
