// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "https://grocerrybackend.onrender.com/api/payments/admin";

// export default function AdminPayments() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios
//       .get(API, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       })
//       .then((res) => setData(res.data.data))
//       .catch((err) => {
//         console.error("Payments fetch error", err);
//         alert("Failed to load payments");
//       });
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>💳 Payments</h2>

//       {data.length === 0 && <p>No payments found</p>}

//       {data.map((p) => (
//         <div
//           key={p._id}
//           style={{
//             border: "1px solid #ddd",
//             padding: 12,
//             marginBottom: 10,
//             borderRadius: 8,
//             background: "#fff",
//           }}
//         >
//           <b>{p.user?.name || "User"}</b>
//           <p>Amount: ₹{p.amount}</p>
//           <p>Status: {p.status}</p>
//           <p>Payment ID: {p.razorpayPaymentId || "Pending"}</p>
//           <p>Order ID: {p.order?._id}</p>
//         </div>
//       ))}
//     </div>
//   );
// }












import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  CreditCard, 
  User, 
  IndianRupee, 
  Hash, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

const API = "https://grocerrybackend.onrender.com/api/payments/admin";

export default function AdminPayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.error("Payments fetch error", err);
        alert("Failed to load payments");
      })
      .finally(() => setLoading(false));
  }, []);

  // Status Badge Logic
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'captured':
      case 'success':
        return "bg-green-100 text-green-700 border-green-200";
      case 'pending':
        return "bg-amber-100 text-amber-700 border-amber-200";
      case 'failed':
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
        Payment Transactions
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-blue-600 font-medium">Loading transactions...</div>
      ) : (
        <>
          {data.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-12 text-center">
              <CreditCard className="mx-auto text-gray-200 mb-2" size={48} />
              <p className="text-gray-400 font-medium">No payments found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <User size={16} className="text-slate-500" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">
                        {p.user?.name || "Unknown User"}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* Amount Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <IndianRupee size={16} /> Amount
                      </div>
                      <span className="text-lg font-extrabold text-slate-800">
                        ₹{p.amount}
                      </span>
                    </div>

                    {/* IDs Section */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Hash size={16} className="text-blue-500 mt-0.5" />
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment ID</p>
                          <p className="text-xs font-mono text-slate-600 truncate">
                            {p.razorpayPaymentId || "Pending / Null"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <ShoppingBag size={16} className="text-blue-500 mt-0.5" />
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Reference</p>
                          <p className="text-xs font-mono text-slate-600 truncate">
                            {p.order?._id || "No Reference"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Decoration */}
                  <div className="h-1.5 w-full bg-slate-50 flex">
                     <div className={`h-full ${p.status === 'success' || p.status === 'captured' ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: '100%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}