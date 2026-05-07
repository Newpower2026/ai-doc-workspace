
import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import "./App.css";

function MenuBar({ editor }) {
  if (!editor) return null;

  return (
    <div className="toolbar">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>

      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </button>

      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Underline
      </button>

      <button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        Bullet List
      </button>
    </div>
  );
}

function App() {
  const [title, setTitle] = useState("Untitled Document");
  const [user, setUser] = useState("Alice");
  const [sharedWith, setSharedWith] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p>Start typing...</p>",
  });

  const saveDocument = () => {
    if (!title.trim()) {
      alert("Please enter a document title.");
      return;
    }

    const doc = {
      title,
      content: editor.getHTML(),
      owner: user,
      sharedWith,
      updatedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("document", JSON.stringify(doc));

    alert("Document saved.");
  };

  const loadDocument = () => {
    const saved = JSON.parse(localStorage.getItem("document"));

    if (saved) {
      setTitle(saved.title);
      setSharedWith(saved.sharedWith);
      editor.commands.setContent(saved.content);
    } else {
      alert("No saved document found.");
    }
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      alert("Only .txt and .md files are supported in this MVP.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      editor.commands.setContent(`<p>${event.target.result}</p>`);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    };

    reader.readAsText(file);
  };

  const savedDoc = JSON.parse(localStorage.getItem("document"));

  const isOwnedByCurrentUser = savedDoc?.owner === user;
  const isSharedWithCurrentUser = savedDoc?.sharedWith === user;

  return (
    <div className="container">
      <h1>AI Document Workspace</h1>

      <p className="subtitle">
        Create, edit, upload, save, reopen, and share lightweight documents.
      </p>

      <div className="topbar">
        <select value={user} onChange={(e) => setUser(e.target.value)}>
          <option>Alice</option>
          <option>Bob</option>
        </select>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
        />

        <select
          value={sharedWith}
          onChange={(e) => setSharedWith(e.target.value)}
        >
          <option value="">Share With</option>
          <option>Bob</option>
          <option>Alice</option>
        </select>

        <button onClick={saveDocument}>Save</button>

        <button onClick={loadDocument}>Load</button>

        <input type="file" accept=".txt,.md" onChange={uploadFile} />
      </div>

      <MenuBar editor={editor} />

      <EditorContent editor={editor} className="editor" />

      <div className="document-panels">
        <div className="panel">
          <h2>Owned by Me</h2>

          {isOwnedByCurrentUser ? (
            <div className="doc-card">
              <strong>{savedDoc.title}</strong>
              <p>Owner: {savedDoc.owner}</p>
              <p>Shared with: {savedDoc.sharedWith || "Nobody"}</p>
              <p>Last saved: {savedDoc.updatedAt}</p>
            </div>
          ) : (
            <p className="empty">No owned documents saved for this user.</p>
          )}
        </div>

        <div className="panel">
          <h2>Shared With Me</h2>

          {isSharedWithCurrentUser ? (
            <div className="doc-card">
              <strong>{savedDoc.title}</strong>
              <p>Owner: {savedDoc.owner}</p>
              <p>Shared with: {savedDoc.sharedWith}</p>
              <p>Last saved: {savedDoc.updatedAt}</p>
            </div>
          ) : (
            <p className="empty">No shared documents available for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;