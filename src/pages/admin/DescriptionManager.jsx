
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DescriptionManager.css";

const API = "https://grocerrybackend.onrender.com/api/descriptions";

export default function DescriptionManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    description: "",
    id: null,
  });

  // Load all
  const fetchItems = async () => {
    const res = await axios.get(API);
    setItems(res.data.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return alert("Enter title!");

    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      alert("Updated!");
    } else {
      await axios.post(API, form);
      alert("Created!");
    }

    setForm({ title: "", description: "" });
    setEditId(null);
    fetchItems();
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete item?")) return;
    await axios.delete(`${API}/${id}`);
    fetchItems();
  };

  // Modal open
  const openModal = (item) => {
    setModalData({
      title: item.title,
      description: item.description,
      id: item._id,
    });
    setModalOpen(true);
  };

  // Modal save
  const saveModal = async () => {
    await axios.put(`${API}/${modalData.id}`, {
      title: modalData.title,
      description: modalData.description,
    });
    setModalOpen(false);
    fetchItems();
  };

  return (
    <div className="desc-container">
      {/* <h2>Description Manager</h2>

      <button className="desc-add-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add Description"}
      </button> */}
      <div className="desc-header-row">
  <h2>Description Manager</h2>

  <button className="desc-add-btn"
    onClick={() => setShowForm(!showForm)}
  >
    {showForm ? "Close Form" : "Add Description"}
  </button>
</div>


      {showForm && (
        <form className="desc-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="desc-input"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="desc-textarea"
          />

          <button className="desc-save-btn">
            {editId ? "Update" : "Save"}
          </button>
        </form>
      )}

      <div className="desc-list">
        {items.map((item) => (
          <div key={item._id} className="desc-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <div className="desc-actions">
              <button
                className="desc-edit-btn"
                onClick={() => openModal(item)}
              >
                Edit
              </button>

              <button
                className="desc-delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="desc-modal-overlay">
          <div className="desc-modal">
            <h3>Edit Description</h3>

            <input
              type="text"
              className="desc-input"
              value={modalData.title}
              onChange={(e) =>
                setModalData({ ...modalData, title: e.target.value })
              }
            />

            <textarea
              className="desc-textarea"
              value={modalData.description}
              onChange={(e) =>
                setModalData({ ...modalData, description: e.target.value })
              }
            />

            <button className="desc-save-btn" onClick={saveModal}>
              Update
            </button>

            <button
              className="desc-cancel-btn"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
