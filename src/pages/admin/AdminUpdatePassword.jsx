// import React, { useState } from "react";
// import axios from "axios";
// import { Eye, EyeOff, Lock } from "react-feather";
// import { useNavigate } from "react-router-dom";

// export default function AdminUpdatePassword() {
//   const navigate = useNavigate();

//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [showOld, setShowOld] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (newPassword.length < 5) {
//       return setError("New password must be at least 5 characters");
//     }

//     if (newPassword !== confirmPassword) {
//       return setError("New password and confirm password do not match");
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       await axios.put(
//         "https://grocerrybackend.onrender.com/api/admin/update-password",
//         {
//           oldPassword,
//           newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSuccess("Password updated successfully. Please login again.");

//       setTimeout(() => {
//         localStorage.clear();
//         navigate("/login", { replace: true });
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleSubmit} style={styles.card}>
//         <h2 style={styles.title}>Update Password</h2>

//         {error && <p style={styles.error}>{error}</p>}
//         {success && <p style={styles.success}>{success}</p>}

//         {/* OLD PASSWORD */}
//         <div style={styles.inputGroup}>
//           <Lock size={16} />
//           <input
//             type={showOld ? "text" : "password"}
//             placeholder="Current Password"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//             required
//           />
//           <span onClick={() => setShowOld(!showOld)} style={styles.eye}>
//             {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
//           </span>
//         </div>

//         {/* NEW PASSWORD */}
//         <div style={styles.inputGroup}>
//           <Lock size={16} />
//           <input
//             type={showNew ? "text" : "password"}
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <span onClick={() => setShowNew(!showNew)} style={styles.eye}>
//             {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
//           </span>
//         </div>

//         {/* CONFIRM PASSWORD */}
//         <div style={styles.inputGroup}>
//           <Lock size={16} />
//           <input
//             type={showConfirm ? "text" : "password"}
//             placeholder="Confirm New Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <span onClick={() => setShowConfirm(!showConfirm)} style={styles.eye}>
//             {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
//           </span>
//         </div>

//         <button disabled={loading} style={styles.button}>
//           {loading ? "Updating..." : "Update Password"}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const styles = {
//   container: {
//     minHeight: "70vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     width: 380,
//     background: "#fff",
//     padding: 24,
//     borderRadius: 10,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//     display: "flex",
//     flexDirection: "column",
//     gap: 14,
//   },
//   title: {
//     margin: 0,
//     textAlign: "center",
//   },
//   inputGroup: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     border: "1px solid #e5e7eb",
//     borderRadius: 6,
//     padding: "8px 10px",
//   },
//   eye: {
//     cursor: "pointer",
//   },
//   button: {
//     marginTop: 10,
//     background: "linear-gradient(135deg, #983a30 0%, #c0392b 100%)",
//     color: "#fff",
//     border: "none",
//     padding: "10px",
//     borderRadius: 6,
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   error: {
//     color: "#ef4444",
//     fontSize: 14,
//     textAlign: "center",
//   },
//   success: {
//     color: "#16a34a",
//     fontSize: 14,
//     textAlign: "center",
//   },
// };




















import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, Shield } from "react-feather";
import { useNavigate } from "react-router-dom";
import "./AdminUpdatePassword.css";

export default function AdminUpdatePassword() {
  const navigate = useNavigate();

  // --- Original Functionality States ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Original Submit Logic (Unchanged) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 5) {
      return setError("New password must be at least 5 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        "https://grocerrybackend.onrender.com/api/admin/update-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Password updated successfully. Please login again.");

      setTimeout(() => {
        localStorage.clear();
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-pwd-container">
      {/* Page Header */}
      <div className="tm-pwd-header">
        <h2 className="tm-pwd-title">Security Settings</h2>
        <p className="tm-pwd-subtitle">Update your administrator password</p>
      </div>

      <div className="tm-pwd-card">
        <div className="tm-pwd-card-head">
          <Shield size={20} className="tm-text-blue" />
          <h3>Change Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="tm-pwd-card-body">
          {error && <div className="tm-alert-error">{error}</div>}
          {success && <div className="tm-alert-success">{success}</div>}

          {/* OLD PASSWORD */}
          <div className="tm-pwd-field">
            <label>Current Password</label>
            <div className="tm-pwd-input-group">
              <Lock className="tm-pwd-icon" size={18} />
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowOld(!showOld)} className="tm-pwd-eye">
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="tm-pwd-field">
            <label>New Password</label>
            <div className="tm-pwd-input-group">
              <Lock className="tm-pwd-icon" size={18} />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Min. 5 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowNew(!showNew)} className="tm-pwd-eye">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="tm-pwd-field">
            <label>Confirm New Password</label>
            <div className="tm-pwd-input-group">
              <Lock className="tm-pwd-icon" size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowConfirm(!showConfirm)} className="tm-pwd-eye">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <button disabled={loading} className="tm-pwd-btn">
            {loading ? "Updating..." : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}