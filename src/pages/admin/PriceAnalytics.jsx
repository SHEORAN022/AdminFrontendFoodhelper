
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";
import "./PriceAnalytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

const API_BASE = "https://grocerrybackend.onrender.com/api";

// ✅ Centralized helper — saare components mein yahi use karo
const flattenProducts = (data = []) => {
  const list = [];
  data.forEach(cat => {
    (cat.subcategories || []).forEach(sub => {
      // Level 3: subSubcategories → products
      (sub.subSubcategories || []).forEach(subSub => {
        (subSub.products || []).forEach(p => list.push({ ...p, categoryName: cat.name }));
      });
      // Level 2 fallback: sub → products
      (sub.products || []).forEach(p => list.push({ ...p, categoryName: cat.name }));
    });
  });
  // Deduplicate by _id
  const seen = new Set();
  return list.filter(p => {
    if (!p._id || seen.has(String(p._id))) return false;
    seen.add(String(p._id));
    return true;
  });
};

export default function PriceAnalytics() {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [chartData, setChartData] = useState(null);

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/prices`),
      axios.get(`${API_BASE}/categories`),
    ]).then(([priceRes, catRes]) => {
      const products = flattenProducts(priceRes.data.data);
      console.log("✅ Analytics products loaded:", products.length);
      setProductList(products);
      setCategoryList(catRes.data.categories || []);
    }).catch(err => {
      console.error("Dropdown load error:", err);
    });
  }, []);

  /* ================= FETCH CHART DATA ================= */
  const fetchChart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/prices`);
      let data = flattenProducts(res.data.data);

      if (selectedProduct)  data = data.filter(p => p.name === selectedProduct);
      // if (selectedCategory) data = data.filter(p => p.categoryName === selectedCategory);

      if (data.length === 0) {
        setChartData(null);
        setLoading(false);
        return;
      }

      data.sort((a, b) => new Date(a.createdAt || a.validTill) - new Date(b.createdAt || b.validTill));

      const labels = data.map(item =>
        new Date(item.createdAt || item.validTill).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })
      );

      // const prices = data.map(item => (Number(item.basePrice) || 0) + (Number(item.difference) || 0));

      const prices = data.map(item => Number(item.salePrice) || 0);

      if (labels.length === 1) {
        labels.unshift("Earlier");
        prices.unshift(prices[0]);
      }

      setChartData({
        labels,
        datasets: [
          {
            // label: "Price",
            label: "Sale Price",
            data: prices,
            borderColor: "#3C50E0",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, "rgba(60, 80, 224, 0.2)");
              gradient.addColorStop(1, "rgba(60, 80, 224, 0)");
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#3C50E0",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      });
    } catch (err) {
      console.error("Chart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChart();
  }, [selectedProduct]);

  return (
    <div className="tm-analytics-wrapper m-4">
      <div className="tm-card-header">
        <div className="tm-header-left">
          <h2 className="tm-card-title">Price Analytics</h2>
          <p className="tm-card-subtitle">Jun 1, 2024 - Dec 1, 2025</p>
        </div>

        <div className="tm-filter-section">
          <div className="tm-select-wrapper">
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
              <option value="">All Products</option>
              {productList.map(p => (
                <option key={p._id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      <div className="tm-chart-container">
        {loading ? (
          <div className="tm-loading-state">
            <div className="spinner"></div>
            <span>Loading Analytics...</span>
          </div>
        ) : chartData ? (
          <div className="tm-canvas-wrapper">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: { color: "#F1F5F9", drawBorder: false },
                    ticks: { color: "#64748B", font: { size: 12 } }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: "#64748B", font: { size: 12 } }
                  },
                },
                plugins: {
                  legend: { display: false },
                  datalabels: {
                    display: true,
                    align: "top",
                    color: "#3C50E0",
                    formatter: v => `₹${v}`,
                    font: { weight: "600", size: 11 },
                  },
                  tooltip: {
                    backgroundColor: "#1C2434",
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    displayColors: false,
                  }
                },
              }}
            />
          </div>
        ) : (
          <div className="tm-no-data">No price history found</div>
        )}
      </div>
    </div>
  );
}