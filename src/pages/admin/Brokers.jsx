import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://grocerrybackend.onrender.com/api/brokers";

export default function BrokersList() {
  const [brokers, setBrokers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    const res = await axios.get(API_URL);
    setBrokers(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: "", email: "", phone: "", company: "", location: "", password: "" });
    fetchBrokers();
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      email: b.email,
      phone: b.phone,
      company: b.company,
      location: b.location,
      password: "",
    });
    setEditId(b._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this broker?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchBrokers();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    await axios.put(`${API_URL}/${id}`, { status: newStatus });
    fetchBrokers();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">👨‍💼 Broker Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-3">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" required />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="border p-2 rounded" />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-2 rounded" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 rounded" required={!editId} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 mt-3 rounded">
          {editId ? "Update Broker" : "Add Broker"}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-3 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setEditId(null)}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Joined</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brokers.map((b) => (
            <tr key={b._id}>
              <td className="border p-2">{b.name}</td>
              <td className="border p-2">{b.email}</td>
              <td className="border p-2">{b.phone}</td>
              <td className="border p-2">{b.company}</td>
              <td className="border p-2">{b.location}</td>
              <td className="border p-2">
                <button
                  onClick={() => toggleStatus(b._id, b.status)}
                  className={`px-3 py-1 rounded text-white ${b.status === "Active" ? "bg-green-600" : "bg-red-600"}`}
                >
                  {b.status}
                </button>
              </td>
              <td className="border p-2">{new Date(b.joinedAt).toLocaleDateString()}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(b)} className="bg-yellow-400 px-3 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
