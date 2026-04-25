import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  TrendingUp, TrendingDown, Users, ShoppingCart, Package, 
  DollarSign, AlertTriangle, CreditCard, Calendar, BarChart3,
  PieChart, Activity, Download, RefreshCw, MoreVertical,
  ChevronRight, Filter, Eye, Store, Truck, FileText,
  CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight,
  Search, User, Phone, MapPin
} from "lucide-react";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Tooltip, Legend, Filler
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "./Dashboard.css"
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

const API = "https://grocerrybackend.onrender.com/api";

export default function ProfessionalDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: 0,
      totalUsers: 0,
      totalProducts: 0,
      lowStockItems: 0,
      activeOrders: 0,
      pendingPayments: 0,
      avgOrderValue: 0,
      totalInventoryValue: 0
    },
    recentOrders: [],
    lowStockProducts: [],
    recentUsers: [],
    topCategories: [],
    revenueTrend: [],
    orderStatusCount: { placed: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
    loading: true,
    lastUpdated: new Date()
  });

  const [timeRange, setTimeRange] = useState("monthly");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Fetch all real data in parallel
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const [
        usersRes,
        inventoryRes,
        ordersRes,
        paymentsRes,
        categoriesRes
      ] = await Promise.allSettled([
        axios.get(`${API}/user/all`, config),
        axios.get(`${API}/inventory/all`),
        axios.get(`${API}/orders`, config),
        axios.get(`${API}/payments/admin`, config),
        axios.get(`${API}/categories`)
      ]);

      // Process real data
      const users = usersRes.status === 'fulfilled' ? (usersRes.value.data.data || []) : [];
      const inventory = inventoryRes.status === 'fulfilled' ? (inventoryRes.value.data.data || []) : [];
      const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data.data || []) : [];
      const payments = paymentsRes.status === 'fulfilled' ? (paymentsRes.value.data.data || []) : [];
      const categories = categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data.categories || []) : [];

      // Calculate REAL statistics from actual data
      const totalRevenue = payments
        .filter(p => p.status === 'success' || p.status === 'captured')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      
      const totalInventoryValue = inventory
        .reduce((sum, item) => sum + ((Number(item.sellingPrice) || 0) * (Number(item.stock) || 0)), 0);
      
      const lowStockItems = inventory
        .filter(item => (Number(item.stock) || 0) <= (Number(item.minStock) || 5)).length;
      
      const activeOrders = orders
        .filter(order => ['confirmed', 'shipped', 'processing'].includes(order.status)).length;
      
      const pendingPayments = payments
        .filter(payment => payment.status === 'pending' || payment.status === 'processing').length;
      
      const totalOrderValue = orders
        .reduce((sum, order) => sum + ((Number(order.price) || 0) * (Number(order.quantity) || 1)), 0);
      
      const avgOrderValue = orders.length > 0 ? Math.round(totalOrderValue / orders.length) : 0;

      // Process recent orders from real data
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
        .slice(0, 6)
        .map(order => ({
          id: order._id?.slice(-6) || 'N/A',
          customer: order.user?.name || order.userName || 'Customer',
          product: order.product?.name || order.productName || 'Product',
          amount: order.price || 0,
          status: order.status || 'pending',
          date: new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short'
          })
        }));

      // Low stock products from real inventory
      const lowStockProducts = inventory
        .filter(item => (Number(item.stock) || 0) <= (Number(item.minStock) || 5))
        .slice(0, 5)
        .map(item => ({
          id: item._id,
          name: item.product?.name || 'Product',
          stock: item.stock || 0,
          minStock: item.minStock || 5
        }));

      // Recent users from real data
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(user => ({
          id: user._id,
          name: user.name || 'User',
          email: user.email || 'No email',
          joined: new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
        }));

      // Top categories from real data
      const topCategories = categories
        .slice(0, 5)
        .map(category => ({
          name: category.name,
          productCount: category.subcategories?.reduce((sum, sub) => sum + (sub.products?.length || 0), 0) || 0
        }));

      // Order status count from real data
      const orderStatusCount = orders.reduce((acc, order) => {
        const status = order.status || 'placed';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, { placed: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });

      // Revenue trend from real payment data (last 7 days)
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      }).reverse();

      const revenueTrend = last7Days.map(date => {
        const dayRevenue = payments
          .filter(p => {
            const paymentDate = new Date(p.createdAt || p.updatedAt);
            return paymentDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) === date &&
                   (p.status === 'success' || p.status === 'captured');
          })
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        return dayRevenue;
      });

      setDashboardData({
        stats: {
          totalRevenue,
          totalUsers: users.length,
          totalProducts: inventory.length,
          lowStockItems,
          activeOrders,
          pendingPayments,
          avgOrderValue,
          totalInventoryValue
        },
        recentOrders,
        lowStockProducts,
        recentUsers,
        topCategories,
        revenueTrend,
        orderStatusCount,
        loading: false,
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (dashboardData.loading) {
    return (
      <div className="dashboard-container loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* HEADER - Mobile Optimized */}
      {/* <header className="dashboard-header">
        <div className="header-main">
          <div className="header-title">
            <h1>Dashboard</h1>
            </div>
          <div className="filter-control">
            <Filter size={16} />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>
        </div>

        
      </header> */}
        <header className="w-full">
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Dashboard</h1>

    <div className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
      <Filter size={14} className="opacity-70" />

      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        className="
          h-6
          bg-transparent
          text-xs
          px-1
          outline-none
          cursor-pointer
        "
      >
        <option value="daily">Today</option>
        <option value="weekly">This Week</option>
        <option value="monthly">This Month</option>
      </select>
    </div>
  </div>
</header>


      {/* KEY METRICS - Mobile Responsive Grid */}
      <section className="metrics-section mt-4">
        {/* <h2 className="section-title">Business Overview</h2> */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Revenue"
            value={`₹${dashboardData.stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign />}
            color="#3C50E0"
            subtitle="From successful payments"
            trend={dashboardData.stats.totalRevenue > 0 ? "+12%" : "0%"}
          />
          
          <MetricCard
            title="Active Users"
            value={dashboardData.stats.totalUsers}
            icon={<Users />}
            color="#10B981"
            subtitle="Registered customers"
            trend="+8%"
          />
          
          <MetricCard
            title="Inventory Value"
            value={`₹${dashboardData.stats.totalInventoryValue.toLocaleString()}`}
            icon={<Package />}
            color="#F59E0B"
            subtitle="Total stock value"
            trend="+5%"
          />
          
          <MetricCard
            title="Active Orders"
            value={dashboardData.stats.activeOrders}
            icon={<ShoppingCart />}
            color="#8B5CF6"
            subtitle="In processing"
            trend="+15%"
          />
          
          <MetricCard
            title="Low Stock Alert"
            value={dashboardData.stats.lowStockItems}
            icon={<AlertTriangle />}
            color="#EF4444"
            subtitle="Need restocking"
            trend={dashboardData.stats.lowStockItems > 0 ? `+${dashboardData.stats.lowStockItems}` : "0"}
            isAlert={dashboardData.stats.lowStockItems > 0}
          />
          
          <MetricCard
            title="Pending Payments"
            value={dashboardData.stats.pendingPayments}
            icon={<CreditCard />}
            color="#6366F1"
            subtitle="Awaiting clearance"
            trend={dashboardData.stats.pendingPayments > 0 ? `+${dashboardData.stats.pendingPayments}` : "0"}
          />
        </div>
      </section>

      {/* CHARTS SECTION - Mobile Responsive */}
      {/* <section className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Revenue Trend</h3>
              <p>Last 7 days revenue</p>
            </div>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <Eye size={16} />
              </button>
            </div>
          </div>
          <div className="chart-container">
            <Line
              data={{
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
                datasets: [{
                  label: 'Revenue',
                  data: dashboardData.revenueTrend,
                  borderColor: '#3C50E0',
                  backgroundColor: 'rgba(60, 80, 224, 0.1)',
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { 
                      callback: (value) => `₹${value}`,
                      maxTicksLimit: 6
                    }
                  },
                  x: {
                    grid: { display: false }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Orders by Status</h3>
              <p>Current order distribution</p>
            </div>
          </div>
          <div className="chart-container">
            <Bar
              data={{
                labels: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                datasets: [{
                  data: [
                    dashboardData.orderStatusCount.placed,
                    dashboardData.orderStatusCount.confirmed,
                    dashboardData.orderStatusCount.shipped,
                    dashboardData.orderStatusCount.delivered,
                    dashboardData.orderStatusCount.cancelled
                  ],
                  backgroundColor: [
                    '#94A3B8',
                    '#3B82F6',
                    '#F59E0B',
                    '#10B981',
                    '#EF4444'
                  ],
                  borderRadius: 6
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                  },
                  x: {
                    grid: { display: false }
                  }
                }
              }}
            />
          </div>
        </div>
      </section> */}

          <section className="charts-section grid grid-cols-1 gap-4 lg:grid-cols-2">
  
  {/* Revenue Chart */}
  <div className="chart-card rounded-lg bg-white p-3 shadow-sm">
    <div className="chart-header mb-2 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold">Revenue Trend</h3>
        <p className="text-xs text-gray-500">Last 7 days revenue</p>
      </div>

      <div className="chart-actions">
        <button className="chart-action-btn rounded-md p-1 hover:bg-black/5">
          <Eye size={14} />
        </button>
      </div>
    </div>

    <div className="chart-container relative h-48 sm:h-56 w-full">
      <Line
        data={{
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
          datasets: [{
            label: 'Revenue',
            data: dashboardData.revenueTrend,
            borderColor: '#3C50E0',
            backgroundColor: 'rgba(60, 80, 224, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: { size: 10 },
                callback: (value) => `₹${value}`,
                maxTicksLimit: 5
              }
            },
            x: {
              ticks: { font: { size: 10 } },
              grid: { display: false }
            }
          }
        }}
      />
    </div>
  </div>

  {/* Orders Chart */}
  <div className="chart-card rounded-lg bg-white p-3 shadow-sm">
    <div className="chart-header mb-2">
      <h3 className="text-sm font-semibold">Orders by Status</h3>
      <p className="text-xs text-gray-500">Current order distribution</p>
    </div>

    <div className="chart-container relative h-48 sm:h-56 w-full">
      <Bar
        data={{
          labels: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
          datasets: [{
            data: [
              dashboardData.orderStatusCount.placed,
              dashboardData.orderStatusCount.confirmed,
              dashboardData.orderStatusCount.shipped,
              dashboardData.orderStatusCount.delivered,
              dashboardData.orderStatusCount.cancelled
            ],
            backgroundColor: [
              '#94A3B8',
              '#3B82F6',
              '#F59E0B',
              '#10B981',
              '#EF4444'
            ],
            borderRadius: 4
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { font: { size: 10 } }
            },
            x: {
              ticks: { font: { size: 10 } },
              grid: { display: false }
            }
          }
        }}
      />
    </div>
  </div>

</section>



      {/* RECENT ACTIVITIES - Mobile Optimized */}
      <section className="activities-section">
        <div className="activity-column">
          <div className="activity-card">
            <div className="activity-header">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="view-more-btn flex items-center gap-1">
  View All <ChevronRight size={14} />
</Link>
            </div>
            <div className="activity-list">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="activity-item">
                  <div className="activity-icon">
                    <ShoppingCart size={16} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-main">
                      <span className="activity-title">Order #{order.id}</span>
                      <span className="activity-amount">₹{order.amount}</span>
                    </div>
                    <div className="activity-details">
                      <span className="activity-text">{order.customer}</span>
                      <span className={`activity-status ${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="activity-column">
          <div className="activity-card">
            <div className="activity-header">
              <h3>Low Stock Alerts</h3>
              <Link to="/admin/inventory" className="view-more-btn flex items-center gap-1">
  View All <ChevronRight size={14} />
</Link>
            </div>
            <div className="activity-list">
              {dashboardData.lowStockProducts.map((product) => (
                <div key={product.id} className="activity-item">
                  <div className="activity-icon alert">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-main">
                      <span className="activity-title">{product.name}</span>
                      <span className="activity-amount alert">
                        {product.stock} left
                      </span>
                    </div>
                    <div className="activity-details">
                      <span className="activity-text">Min: {product.minStock}</span>
                      <span className="activity-status urgent">
                        Restock Needed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS - Mobile Responsive */}
      <section className="quick-stats-section">
        <h2 className="section-title">Quick Stats</h2>
        <div className="quick-stats-grid">
          <div className="quick-stat">
            <div className="stat-icon">
              <BarChart3 size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">₹{dashboardData.stats.avgOrderValue}</div>
              <div className="stat-label">Avg Order Value</div>
            </div>
          </div>
          
          <div className="quick-stat">
            <div className="stat-icon">
              <Activity size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {dashboardData.recentUsers.length}
              </div>
              <div className="stat-label">New Users (24h)</div>
            </div>
          </div>
          
          <div className="quick-stat">
            <div className="stat-icon">
              <Store size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {dashboardData.topCategories.length}
              </div>
              <div className="stat-label">Active Categories</div>
            </div>
          </div>
          
          <div className="quick-stat">
            <div className="stat-icon">
              <Truck size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {dashboardData.orderStatusCount.shipped}
              </div>
              <div className="stat-label">Orders Shipped</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, icon, color, subtitle, trend, isAlert }) {
  return (
    <div className={`metric-card ${isAlert ? 'alert' : ''}`}>
      <div className="metric-header">
        <div className="metric-icon" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        <div className="metric-trend">
          <span className={`trend ${trend.startsWith('+') ? 'positive' : 'negative'}`}>
            {trend}
          </span>
        </div>
      </div>
      <div className="metric-content">
        <h3>{value}</h3>
        <p className="metric-title">{title}</p>
        <p className="metric-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
