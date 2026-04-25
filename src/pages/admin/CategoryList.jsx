import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryList.css";

const API = "https://grocerrybackend.onrender.com/api/categories";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="catlist-container">
      
      {/* Search */}
      <div className="catlist-search-wrapper">
        <div className="catlist-search-box">
          <span className="catlist-search-icon">🔍</span>
         
          <input
            type="text"
            placeholder="Search category..."
            className="catlist-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ALWAYS SHOW TABLE (desktop + mobile) */}
      <div className="catlist-table-wrapper">
        <table className="catlist-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No categories found</td>
              </tr>
            ) : (
              filtered.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={cat.image || "https://via.placeholder.com/100"}
                      className="catlist-img"
                      alt=""
                    />
                  </td>
                  <td>{cat.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
