import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await axios.get("http://localhost:5000/entries");
    setEntries(response.data);
  };

  const validateForm = () => {
    if (!name || !description) {
      setError("Name and description cannot be empty");
      return false;
    }
    setError("");
    return true;
  };

  const addEntry = async () => {
    if (!validateForm()) return;
    const response = await axios.post("http://localhost:5000/entries", {
      name,
      description,
    });
    setEntries([...entries, response.data]);
    setName("");
    setDescription("");
  };

  const editEntry = (entry) => {
    setEditing(true);
    setCurrentId(entry.id);
    setName(entry.name);
    setDescription(entry.description);
  };

  const updateEntry = async () => {
    if (!validateForm()) return;
    const response = await axios.put(
      `http://localhost:5000/entries/${currentId}`,
      {
        name,
        description,
      }
    );
    setEntries(
      entries.map((entry) => (entry.id === currentId ? response.data : entry))
    );
    setEditing(false);
    setName("");
    setDescription("");
    setCurrentId(null);
  };

  const deleteEntry = async (id) => {
    await axios.delete(`http://localhost:5000/entries/${id}`);
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="container">
      <nav className="navbar">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div className="content">
        <h1>Entry Management System</h1>
        {error && <p className="error">{error}</p>}
        <div className="form-container">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={editing ? updateEntry : addEntry}
            className={editing ? "edit-entry" : "add-entry"}
          >
            {editing ? "Update Entry" : "Add Entry"}
          </button>
        </div>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <div>{entry.name}</div>
              <div>{entry.description}</div>
              <div className="buttons-container">
                <button
                  onClick={() => editEntry(entry)}
                  className="edit-entry-list"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="delete-entry"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
