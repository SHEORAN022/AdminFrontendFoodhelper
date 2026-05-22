
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { Line } from "react-chartjs-2";
// import "./PriceAnalytics.css";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   Filler,
//   ChartDataLabels
// );

// const API_BASE = "https://grocerrybackend.onrender.com/api";

// // ✅ Centralized helper — saare components mein yahi use karo
// const flattenProducts = (data = []) => {
//   const list = [];
//   data.forEach(cat => {
//     (cat.subcategories || []).forEach(sub => {
//       // Level 3: subSubcategories → products
//       (sub.subSubcategories || []).forEach(subSub => {
//         (subSub.products || []).forEach(p => list.push({ ...p, categoryName: cat.name }));
//       });
//       // Level 2 fallback: sub → products
//       (sub.products || []).forEach(p => list.push({ ...p, categoryName: cat.name }));
//     });
//   });
//   // Deduplicate by _id
//   const seen = new Set();
//   return list.filter(p => {
//     if (!p._id || seen.has(String(p._id))) return false;
//     seen.add(String(p._id));
//     return true;
//   });
// };

// export default function PriceAnalytics() {
//   const [loading, setLoading] = useState(true);
//   const [productList, setProductList] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [chartData, setChartData] = useState(null);

//   /* ================= LOAD DROPDOWNS ================= */
//   useEffect(() => {
//     Promise.all([
//       axios.get(`${API_BASE}/prices`),
//       axios.get(`${API_BASE}/categories`),
//     ]).then(([priceRes, catRes]) => {
//       const products = flattenProducts(priceRes.data.data);
//       console.log("✅ Analytics products loaded:", products.length);
//       setProductList(products);
//       setCategoryList(catRes.data.categories || []);
//     }).catch(err => {
//       console.error("Dropdown load error:", err);
//     });
//   }, []);

//   /* ================= FETCH CHART DATA ================= */
//   const fetchChart = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/prices`);
//       let data = flattenProducts(res.data.data);

//       if (selectedProduct)  data = data.filter(p => p.name === selectedProduct);
//       // if (selectedCategory) data = data.filter(p => p.categoryName === selectedCategory);

//       if (data.length === 0) {
//         setChartData(null);
//         setLoading(false);
//         return;
//       }

//       data.sort((a, b) => new Date(a.createdAt || a.validTill) - new Date(b.createdAt || b.validTill));

//       const labels = data.map(item =>
//         new Date(item.createdAt || item.validTill).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })
//       );

//       // const prices = data.map(item => (Number(item.basePrice) || 0) + (Number(item.difference) || 0));

//       const prices = data.map(item => Number(item.salePrice) || 0);

//       if (labels.length === 1) {
//         labels.unshift("Earlier");
//         prices.unshift(prices[0]);
//       }

//       setChartData({
//         labels,
//         datasets: [
//           {
//             // label: "Price",
//             label: "Sale Price",
//             data: prices,
//             borderColor: "#3C50E0",
//             backgroundColor: (context) => {
//               const ctx = context.chart.ctx;
//               const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//               gradient.addColorStop(0, "rgba(60, 80, 224, 0.2)");
//               gradient.addColorStop(1, "rgba(60, 80, 224, 0)");
//               return gradient;
//             },
//             tension: 0.4,
//             fill: true,
//             pointBackgroundColor: "#fff",
//             pointBorderColor: "#3C50E0",
//             pointBorderWidth: 2,
//             pointRadius: 4,
//             pointHoverRadius: 6,
//           },
//         ],
//       });
//     } catch (err) {
//       console.error("Chart error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChart();
//   }, [selectedProduct]);

//   return (
//     <div className="tm-analytics-wrapper m-4">
//       <div className="tm-card-header">
//         <div className="tm-header-left">
//           <h2 className="tm-card-title">Price Analytics</h2>
//           <p className="tm-card-subtitle">Jun 1, 2024 - Dec 1, 2025</p>
//         </div>

//         <div className="tm-filter-section">
//           <div className="tm-select-wrapper">
//             <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
//               <option value="">All Products</option>
//               {productList.map(p => (
//                 <option key={p._id} value={p.name}>{p.name}</option>
//               ))}
//             </select>
//           </div>

//         </div>
//       </div>

//       <div className="tm-chart-container">
//         {loading ? (
//           <div className="tm-loading-state">
//             <div className="spinner"></div>
//             <span>Loading Analytics...</span>
//           </div>
//         ) : chartData ? (
//           <div className="tm-canvas-wrapper">
//             <Line
//               data={chartData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                   y: {
//                     beginAtZero: false,
//                     grid: { color: "#F1F5F9", drawBorder: false },
//                     ticks: { color: "#64748B", font: { size: 12 } }
//                   },
//                   x: {
//                     grid: { display: false },
//                     ticks: { color: "#64748B", font: { size: 12 } }
//                   },
//                 },
//                 plugins: {
//                   legend: { display: false },
//                   datalabels: {
//                     display: true,
//                     align: "top",
//                     color: "#3C50E0",
//                     formatter: v => `₹${v}`,
//                     font: { weight: "600", size: 11 },
//                   },
//                   tooltip: {
//                     backgroundColor: "#1C2434",
//                     padding: 12,
//                     titleFont: { size: 14 },
//                     bodyFont: { size: 14 },
//                     displayColors: false,
//                   }
//                 },
//               }}
//             />
//           </div>
//         ) : (
//           <div className="tm-no-data">No price history found</div>
//         )}
//       </div>
//     </div>
//   );
// }  



import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line, Bar } from "react-chartjs-2";
import "./PriceAnalytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

const API_BASE = "https://grocerrybackend.onrender.com/api";

const BAR_COLORS = [
  "#3C50E0","#22c55e","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#ec4899","#14b8a6","#f97316","#64748b",
  "#a855f7","#0ea5e9","#84cc16","#fb923c","#e879f9",
];

const flattenProducts = (data = []) => {
  const list = [];
  data.forEach((cat) => {
    (cat.subcategories || []).forEach((sub) => {
      (sub.subSubcategories || []).forEach((subSub) => {
        (subSub.products || []).forEach((p) =>
          list.push({ ...p, categoryName: cat.name })
        );
      });
      (sub.products || []).forEach((p) =>
        list.push({ ...p, categoryName: cat.name })
      );
    });
  });
  const seen = new Set();
  return list.filter((p) => {
    if (!p._id || seen.has(String(p._id))) return false;
    seen.add(String(p._id));
    return true;
  });
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "2-digit",
  });

export default function PriceAnalytics() {
  const [loading, setLoading]                 = useState(false);
  const [productList, setProductList]         = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [chartData, setChartData]             = useState(null);
  const [chartType, setChartType]             = useState("line");
  const [error, setError]                     = useState(null);
  const [isFallback, setIsFallback]           = useState(false);
  const [priceStats, setPriceStats]           = useState(null);

  // Dropdown load — /prices se
  useEffect(() => {
    axios
      .get(`${API_BASE}/prices`)
      .then((res) => setProductList(flattenProducts(res.data.data)))
      .catch((err) => console.error("Dropdown load error:", err));
  }, []);

  useEffect(() => { fetchChart(); }, [selectedProduct]);

  const fetchChart = async () => {
    setLoading(true);
    setError(null);
    setChartData(null);
    setIsFallback(false);
    setPriceStats(null);

    try {
      if (selectedProduct) {
        // ── Single product: history se line chart ──────────────────
        setChartType("line");
        const res  = await axios.get(`${API_BASE}/price-analytics/trends`, {
          params: { product: selectedProduct },
        });
        const data = res.data;

        if (!Array.isArray(data) || data.length === 0) {
          setLoading(false);
          return;
        }

        setIsFallback(data.every((d) => d.isFallback));
        buildSingleProductChart(data);

      } else {
        // ── All products: /prices se seedha current salePrice ──────
        setChartType("bar");
        const res  = await axios.get(`${API_BASE}/prices`);
        const flat = flattenProducts(res.data.data || []);

        if (flat.length === 0) {
          setLoading(false);
          return;
        }

        buildAllProductsChart(flat);
      }
    } catch (err) {
      console.error("❌ Chart fetch error:", err);
      const msg    = err?.response?.data?.message || err?.message || "Unknown error";
      const status = err?.response?.status;
      setError(
        status === 404
          ? `Route nahi mila — app.js mein register karo`
          : status === 500
          ? `Server error: ${msg}`
          : `Connection error: ${msg}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Single product: line chart ────────────────────────────────────
  const buildSingleProductChart = (data) => {
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = data.map((d) => formatDate(d.date));
    const prices = data.map((d) => Number(d.salePrice) || 0);

    if (labels.length === 1) {
      labels.unshift("Earlier");
      prices.unshift(prices[0]);
    }

    const first     = prices[0];
    const last      = prices[prices.length - 1];
    const high      = Math.max(...prices);
    const low       = Math.min(...prices);
    const change    = +(last - first).toFixed(2);
    const changePct = first > 0 ? ((change / first) * 100).toFixed(2) : "0.00";
    setPriceStats({ first, last, high, low, change, changePct, mode: "single" });

    const pointBg = prices.map((p, i) => {
      if (i === 0) return "#3C50E0";
      return p > prices[i - 1] ? "#22c55e" : p < prices[i - 1] ? "#ef4444" : "#3C50E0";
    });

    setChartData({
      labels,
      datasets: [{
        label: selectedProduct,
        data:  prices,
        borderColor: "#3C50E0",
        borderWidth: 2,
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 350);
          g.addColorStop(0, "rgba(60,80,224,0.18)");
          g.addColorStop(1, "rgba(60,80,224,0)");
          return g;
        },
        tension: 0.3,
        fill: true,
        pointBackgroundColor: pointBg,
        pointBorderColor:     "#fff",
        pointBorderWidth:     2,
        pointRadius:          6,
        pointHoverRadius:     8,
      }],
    });
  };

  // ── All products: bar chart — /prices se current salePrice ────────
  const buildAllProductsChart = (products) => {
    // Price ke hisaab se sort — highest first
    const sorted = [...products]
      .filter((p) => p.salePrice > 0)
      .sort((a, b) => b.salePrice - a.salePrice);

    const labels = sorted.map((p) => p.name);
    const prices = sorted.map((p) => Number(p.salePrice) || 0);
    const colors = labels.map((_, i) => BAR_COLORS[i % BAR_COLORS.length]);

    const high = Math.max(...prices);
    const low  = Math.min(...prices);
    const avg  = prices.length
      ? +(prices.reduce((s, p) => s + p, 0) / prices.length).toFixed(2)
      : 0;

    setPriceStats({ mode: "all", count: labels.length, high, low, avg });

    setChartData({
      labels,
      datasets: [{
        label:           "Current Sale Price",
        data:            prices,
        backgroundColor: colors.map((c) => c + "cc"),
        borderColor:     colors,
        borderWidth:     1.5,
        borderRadius:    6,
        borderSkipped:   false,
      }],
    });
  };

  const isUp = (priceStats?.change ?? 0) >= 0;

  // ── Bar options ───────────────────────────────────────────────────
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    interaction: { mode: "index", intersect: false },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "#F1F5F9", drawBorder: false },
        ticks: {
          color: "#64748B",
          font: { size: 12 },
          callback: (v) => `₹${v}`,
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748B",
          font: { size: 11 },
          maxRotation: 35,
          callback: function (val) {
            const lbl = this.getLabelForValue(val);
            return lbl.length > 14 ? lbl.slice(0, 13) + "…" : lbl;
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
        anchor:    "end",
        align:     "end",
        offset:    2,
        formatter: (v) => `₹${v}`,
        font:      { weight: "600", size: 10 },
        color:     "#334155",
      },
      tooltip: {
        backgroundColor: "#1C2434",
        padding: 12,
        titleFont: { size: 13 },
        bodyFont:  { size: 13 },
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label || "",
          label: (ctx)   => `Current Price: ₹${ctx.parsed.y}`,
        },
      },
    },
  };

  // ── Line options ──────────────────────────────────────────────────
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "#F1F5F9", drawBorder: false },
        ticks: {
          color: "#64748B",
          font: { size: 12 },
          callback: (v) => `₹${v}`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 11 }, maxRotation: 30 },
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
        align:   "top",
        offset:  6,
        formatter: (v) => `₹${v}`,
        font:    { weight: "600", size: 11 },
        color:   (ctx) => {
          const i    = ctx.dataIndex;
          const vals = ctx.dataset.data;
          if (i === 0) return "#3C50E0";
          return vals[i] > vals[i - 1] ? "#22c55e"
               : vals[i] < vals[i - 1] ? "#ef4444"
               : "#3C50E0";
        },
      },
      tooltip: {
        backgroundColor: "#1C2434",
        padding: 12,
        titleFont: { size: 13 },
        bodyFont:  { size: 13 },
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label || "",
          label: (ctx) => {
            const i    = ctx.dataIndex;
            const vals = ctx.dataset.data;
            const curr = vals[i];
            const prev = i > 0
              ? vals.slice(0, i).reverse().find((v) => v !== null)
              : null;
            if (!prev) return `₹${curr}`;
            const diff  = +(curr - prev).toFixed(2);
            const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "—";
            return `₹${curr}   ${arrow} ₹${Math.abs(diff)}`;
          },
        },
      },
    },
  };

  return (
    <div className="tm-analytics-wrapper m-4">

      <div className="tm-card-header">
        <div className="tm-header-left">
          <h2 className="tm-card-title">Price Analytics</h2>
          {isFallback && !loading && chartData && (
            <p style={{ color: "#f59e0b", fontSize: "12px", marginTop: "2px" }}>
              
            </p>
          )}
        </div>
        <div className="tm-filter-section">
          <div className="tm-select-wrapper">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">All Products</option>
              {productList.map((p) => (
                <option key={p._id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {priceStats && !loading && (
        <div style={{
          display: "flex", gap: "24px", flexWrap: "wrap",
          padding: "8px 2px 14px", fontSize: "13px", color: "#64748B",
        }}>
          {priceStats.mode === "single" ? (
            <>
              <span>Current: <strong style={{ color: "#1e293b" }}>₹{priceStats.last}</strong></span>
              <span>
                Change:{" "}
                <strong style={{ color: isUp ? "#22c55e" : "#ef4444" }}>
                  {isUp ? "▲" : "▼"} ₹{Math.abs(priceStats.change)}{" "}
                  ({isUp ? "+" : ""}{priceStats.changePct}%)
                </strong>
              </span>
              <span>High: <strong style={{ color: "#22c55e" }}>₹{priceStats.high}</strong></span>
              <span>Low:  <strong style={{ color: "#ef4444" }}>₹{priceStats.low}</strong></span>
            </>
          ) : (
            <>
              <span>Total: <strong style={{ color: "#1e293b" }}>{priceStats.count} products</strong></span>
              <span>Highest: <strong style={{ color: "#22c55e" }}>₹{priceStats.high}</strong></span>
              <span>Lowest:  <strong style={{ color: "#ef4444" }}>₹{priceStats.low}</strong></span>
              <span>Average: <strong style={{ color: "#3C50E0" }}>₹{priceStats.avg}</strong></span>
            </>
          )}
        </div>
      )}

      <div className="tm-chart-container">
        {loading ? (
          <div className="tm-loading-state">
            <div className="spinner" /><span>Loading Analytics...</span>
          </div>
        ) : error ? (
          <div className="tm-no-data" style={{ color: "#ef4444", fontSize: "13px", padding: "16px", lineHeight: "1.7" }}>
            ⚠️ {error}
          </div>
        ) : chartData ? (
          <div className="tm-canvas-wrapper">
            {chartType === "bar"
              ? <Bar  data={chartData} options={barOptions}  />
              : <Line data={chartData} options={lineOptions} />
            }
          </div>
        ) : (
          <div className="tm-no-data">
            {selectedProduct
              ? `"${selectedProduct}" ka koi data nahi mila`
              : "Koi product data nahi mila"}
          </div>
        )}
      </div>
    </div>
  );
}
