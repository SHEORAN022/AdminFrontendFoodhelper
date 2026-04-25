

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Globe, ShieldCheck, Ship } from "lucide-react";
import "./Login.css";
import logo from "../assets/WhatsApp Image 2025-12-05 at 13.19.29_68ae0406.jpg"; // Apna logo yahan check kar lena

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://grocerrybackend.onrender.com/api/admin/login", {
        email,
        password,
      });

      if (res.data?.role !== "admin") {
        alert("Access Denied — Admin only");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || "Admin");

      navigate("/admin/pricelist", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* LEFT BRAND SECTION - Desktop par dikhega, Mobile par hide ho jayega */}
        <div className="login-brand-section">
          <div className="brand-content">
            <div className="brand-badge">Official Admin Portal</div>
            <h2 className="brand-title">FOOD HELPER</h2>
            <p className="brand-description">
              A premier leader in global grocery exports. Managing international
              trade and logistics with precision and excellence.
            </p>

            <div className="brand-features">
              <div className="feature">
                <Globe size={20} className="f-icon" />
                <span>Global Export Network</span>
              </div>
              <div className="feature">
                <ShieldCheck size={20} className="f-icon" />
                <span>Quality Standards</span>
              </div>
              <div className="feature">
                <Ship size={20} className="f-icon" />
                <span>Swift Logistics</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION - Mobile par ye full width ho jayega */}
        <div className="login-form-section">
          <div className="form-header">
            {/* <img src={logo} alt="Food Helper" className="login-logo" /> */}
            <h3>Food Helper Login</h3>
            {/* <p>Enter credentials to access dashboard</p> */}
          </div>

          <form onSubmit={submit} className="modern-form">
            <div className="input-field">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Verifying..." : (
                <>
                  <span>Login Now</span>
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <footer className="form-footer">
            © {new Date().getFullYear()} Food Helper Group
          </footer>
        </div>
      </div>
    </div>
  );
}