import React, { useEffect, useState, useRef } from "react";

const STORAGE_KEY = "studentNotes_v1";

function uid() {
  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  const titleRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setNotes(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("Both fields required");

    const note = {
      id: uid(),
      title: title.trim(),
      content: content.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => [note, ...prev]);
    setTitle("");
    setContent("");
    titleRef.current?.focus();
  }

  function deleteNote(id) {
    if (!confirm("Delete permanently?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function startEdit(note) {
    setEditing({ ...note });
  }

  function saveEdit(e) {
    e.preventDefault();

    setNotes((prev) =>
      prev.map((n) =>
        n.id === editing.id
          ? {
              ...n,
              title: editing.title,
              content: editing.content,
              updatedAt: Date.now(),
            }
          : n
      )
    );

    setEditing(null);
  }

  const filtered = query
    ? notes.filter((n) =>
        (n.title + " " + n.content)
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : notes;

  return (
    <div className="app-root">
      <div className="app-card">
        <h1 className="app-title">Student Notes App</h1>
        <p className="muted">Add, edit, delete — saved locally</p>

        <form onSubmit={addNote} className="card">
          <input
            ref={titleRef}
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="textarea"
            placeholder="Write note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button className="btn primary">Add Note</button>
        </form>

        <div className="toolbar">
          <input
            className="input"
            style={{ width: "200px" }}
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="muted">
            {filtered.length} {filtered.length === 1 ? "note" : "notes"}
          </span>
        </div>

        <div className="notes-list">
          {filtered.length === 0 ? (
            <div className="empty">No notes found.</div>
          ) : (
            filtered.map((note) => (
              <div key={note.id} className="note">
                <div style={{ flex: 1 }}>
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-content">{note.content}</p>
                </div>

                <div className="note-actions">
                  <button className="btn" onClick={() => startEdit(note)}>
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {editing && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Edit Note</h3>

              <form onSubmit={saveEdit}>
                <input
                  className="input"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />

                <textarea
                  className="textarea"
                  value={editing.content}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                />

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
