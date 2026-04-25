// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import logo from "../assets/WhatsApp Image 2025-12-05 at 13.19.29_68ae0406.jpg"
// export default function Signup() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('https://grocerrybackend.onrender.com/api/admin/register', { name, email, password });
//       alert('Admin registered successfully. Please login.');
//       navigate('/login');
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Signup failed — check server logs');
//     }
//   };

//   return (
//     <div className="container py-5">
//       <div className="row justify-content-center">
//         <div className="col-md-5 col-lg-4">
//           <div className="card p-4 shadow-sm">
//             <h4 className="mb-3 text-center">Admin Signup</h4>
//             <form onSubmit={submit}>
//               <input
//                 className="form-control mb-2"
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//               <input
//                 type="email"
//                 className="form-control mb-2"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 className="form-control mb-3"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button className="btn btn-success w-100">Signup</button>
//             </form>
//             <div className="text-center mt-3">
//               <small>
//                 Already have an account? <Link to="/login">Login</Link>
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";
import signupImg from "../assets/WhatsApp Image 2025-12-05 at 13.19.29_68ae0406.jpg";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://grocerrybackend.onrender.com/api/admin/register", {
        name,
        email,
        password,
      });

      alert("Admin registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-wrapper">
      {/* LEFT IMAGE */}
      <div className="signup-left">
        <img src={signupImg} alt="Signup Visual" className="signup-image" />
      </div>

      {/* RIGHT FORM */}
      <div className="signup-right">
        <div className="signup-box">
          <h2 className="signup-title">Create Admin Account</h2>
          <p className="signup-subtitle">Register to get started</p>

          <form onSubmit={submit} className="signup-form">

            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Choose password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="signup-btn">Signup</button>
          </form>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
