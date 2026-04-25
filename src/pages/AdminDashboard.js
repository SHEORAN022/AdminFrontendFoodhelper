// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Card({ title, value, icon }) {
//   return (
//     <div className="card p-3 shadow-sm">
//       <div className="d-flex align-items-center">
//         <div style={{ width: 60, height: 60, background: '#f4f8ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
//           {icon}
//         </div>
//         <div>
//           <h3 className="mb-0">{value}</h3>
//           <small className="text-muted">{title}</small>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({ users: 0, brokers: 0, transactions: 0, revenue: 0 });
//   const [recent, setRecent] = useState([]);
//   const name = localStorage.getItem('name') || 'Admin';

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login', { replace: true });
//       return;
//     }

//     // Try to fetch stats (backend must expose /api/admin/stats)
//     axios
//       .get('https://grocerrybackend.onrender.com/api/admin/stats', { headers: { Authorization: 'Bearer ' + token } })
//       .then((res) => setStats(res.data))
//       .catch((err) => {
//         // if unauthorized, logout and redirect
//         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//           localStorage.clear();
//           navigate('/login', { replace: true });
//         } else {
//           console.warn('Could not fetch stats:', err.message);
//         }
//       });

//     axios
//       .get('https://grocerrybackend.onrender.com/api/admin/recent', { headers: { Authorization: 'Bearer ' + token } })
//       .then((res) => setRecent(res.data))
//       .catch(() => {});
//   }, [navigate]);

//   const logout = () => {
//     localStorage.clear();
//     navigate('/login', { replace: true });
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       <aside style={{ width: 240, background: '#13385a', color: '#fff', padding: 24 }}>
//         <h4>Broker Admin</h4>
//         <div className="mt-3">
//           <div>Welcome, <strong>{name}</strong></div>
//         </div>
//         <ul className="list-unstyled mt-4">
//           <li className="py-2">Dashboard</li>
//           <li className="py-2">Users</li>
//           <li className="py-2">Brokers</li>
//           <li className="py-2">Transactions</li>
//           <li className="py-2">Settings</li>
//         </ul>
//         <button className="btn btn-danger mt-3" onClick={logout}>Logout</button>
//       </aside>

//       <main style={{ flex: 1, background: '#f6f9fc', padding: 24 }}>
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2>Dashboard</h2>
//           <div />
//         </div>

//         <div className="row g-3 mb-4">
//           <div className="col-md-3"><Card title="Total Users" value={stats.users} icon="👥" /></div>
//           <div className="col-md-3"><Card title="Total Brokers" value={stats.brokers} icon="💼" /></div>
//           <div className="col-md-3"><Card title="Transactions" value={stats.transactions} icon="🔁" /></div>
//           <div className="col-md-3"><Card title="Revenue" value={typeof stats.revenue === 'number' ? '$' + (stats.revenue / 1000) + 'K' : stats.revenue} icon="💲" /></div>
//         </div>

//         <div className="card p-3 shadow-sm">
//           <h5>Recent Activity <small className="text-primary float-end" style={{ cursor: 'pointer' }}>View All</small></h5>
//           <table className="table mt-3 mb-0">
//             <thead className="table-light">
//               <tr><th>ID</th><th>User</th><th>Action</th><th>Date</th><th>Status</th></tr>
//             </thead>
//             <tbody>
//               {Array.isArray(recent) && recent.length === 0 && <tr><td colSpan={5} className="text-center">No records</td></tr>}
//               {Array.isArray(recent) && recent.map((r) => (
//                 <tr key={r.id}>
//                   <td>{r.id}</td>
//                   <td>{r.user}</td>
//                   <td>{r.action}</td>
//                   <td>{r.date}</td>
//                   <td><span className="badge bg-success">{r.status}</span></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// }
