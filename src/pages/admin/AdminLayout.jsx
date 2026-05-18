import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  BarChart2,
  LogOut,
  Menu,
  Grid,
  Package,
  User,
  CreditCard,
  Home,
  Truck,
  FileText,
  Headphones,
  X,
    Settings,
  UserCheck 
} from "react-feather";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredLink, setHoveredLink] = useState(null);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ================= RESPONSIVE HANDLER ================= */
  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, []);

  const sidebarItems = [
    { to: "/admin", label: "Dashboard", icon: <BarChart2 size={18} /> },
    { to: "/admin/users", label: "Customers", icon: <Users size={18} /> },
      {
    to: "/admin/vendor-approval",
    label: "Vendor Approval",
    icon: <UserCheck size={18} />,
  },
    {
    to: "/admin/category-approval",
    label: "Category Approval",
    icon: <Grid size={18} />,
  },
    { to: "/admin/stores", label: "Stores / Warehouse", icon: <Home size={18} /> },
    { to: "/admin/riders", label: "Delivery Partners", icon: <Truck size={18} /> },
    { to: "/admin/CategoryManager", label: "Add Category", icon: <Grid size={18} /> },
    { to: "/admin/banners", label: "Banners", icon: <Grid size={18} /> },
    { to: "/admin/ads", label: "Advertising Ads", icon: <Grid size={18} /> },
    { to: "/admin/coupons", label: "Coupons", icon: <Grid size={18} /> },
    { to: "/admin/priceanalytics", label: "Analytics", icon: <BarChart2 size={18} /> },
    { to: "/admin/pricelist", label: "Add Product", icon: <Package size={18} /> },
    { to: "/admin/orders", label: "Orders", icon: <Package size={18} /> },
    {
  to: "/admin/service-areas",
  label: "Service Areas",
  icon: <Home size={18} />,
},
    { to: "/admin/payments", label: "Payments", icon: <CreditCard size={18} /> },
    // { to: "/admin/gst", label: "GST & Discounts", icon: <CreditCard size={18} /> },
    { to: "/admin/inventory", label: "Inventory", icon: <Package size={18} /> },
    { to: "/admin/reports", label: "Reports", icon: <FileText size={18} /> },
    { to: "/admin/support", label: "Support", icon: <Headphones size={18} /> },
    {
  to: "/admin/maintenance-settings",
  label: "Maintenance",
  icon: <Settings size={18} />,
},
  ];

  /* ================= STYLES ================= */
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#F1F5F9",
      fontFamily: "'Inter', sans-serif",
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      zIndex: 998,
      backdropFilter: "blur(2px)",
    },
    sidebar: {
      width: 280,
      height: "100vh",
      background: "#FFFFFF",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 999,
      transition: "transform 0.3s ease-in-out",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #E2E8F0",
    },
    logoSection: {
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      height: "80px",
      borderBottom: "1px solid #F1F5F9",
      flexShrink: 0,
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      marginLeft: !isMobile && isSidebarOpen ? 280 : 0,
      transition: "margin-left 0.3s ease-in-out",
    },
    header: {
      background: "#fff",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "80px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid #E2E8F0",
      width: "100%",
    },
    content: {
      padding: 0, // FIXED: Padding 30 se 0 kar di
      flex: 1,
    }
  };

  return (
    <div style={styles.container}>
      {isMobile && isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={styles.overlay} />
      )}

      <aside style={{ ...styles.sidebar, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={styles.logoSection}>
          <div style={{ backgroundColor: "#3C50E0", padding: "6px", borderRadius: "6px", display: "flex" }}>
            <BarChart2 color="white" size={18} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1C2434", margin: 0 }}>Food Helper</h3>
          {isMobile && <X size={22} onClick={() => setIsSidebarOpen(false)} style={{ marginLeft: "auto", cursor: "pointer" }} />}
        </div>

        <div style={{ padding: "20px 24px 10px 24px", fontSize: "11px", fontWeight: "600", color: "#8A99AF" }}>MENU</div>

        <ul className="sidebar-scroll" style={{ listStyle: "none", padding: "0 16px", margin: 0, flex: 1, overflowY: "auto" }}>
          {sidebarItems.map((item, i) => {
            const active = location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to));
            return (
              <li key={i} style={{ marginBottom: "2px" }}>
                <Link
                  to={item.to}
                  onMouseEnter={() => setHoveredLink(i)}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: "6px",
                    color: active ? "#3C50E0" : "#64748B",
                    fontSize: "14px",
                    fontWeight: active ? "600" : "500",
                    textDecoration: "none",
                    backgroundColor: active ? "#EFF6FF" : hoveredLink === i ? "#F8FAFC" : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button onClick={logout} style={{ background: "none", border: "1px solid #E2E8F0", padding: "10px", color: "#E11D48", borderRadius: "6px", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, margin: "16px", fontSize: "14px" }}>
          <LogOut size={16} /> Logout Account
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", display: 'flex', padding: 0 }}>
              <Menu size={24} color="#64748B" />
            </button>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1C2434" }}></h3>
          </div>

          <div onClick={() => navigate("/admin/update-password")} style={{ width: 38, height: 38, borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyCenter: "center", cursor: "pointer", border: "1px solid #E2E8F0", justifyContent: 'center' }}>
            <User size={18} color="#64748B" />
          </div>
        </header>

        <div style={styles.content}>
          <Outlet />
        </div>
      </main>

      <style>
        {`
          .sidebar-scroll::-webkit-scrollbar { display: none; }
          .sidebar-scroll { scrollbar-width: none; }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `}
      </style>
    </div>
  );
}