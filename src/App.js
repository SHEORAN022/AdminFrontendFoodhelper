
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin Layout & Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import InvoicePage from "./pages/admin/InvoicePage";
import Estimateinvoicepage from "./pages/admin/Estimateinvoicepage";
import AdvertisingBannerPage from "./pages/admin/AdvertisingBannerPage";
import MaintenanceSettings from "./pages/admin/MaintenanceSettings";
import Users from "./pages/admin/Users";
import Brokers from "./pages/admin/Brokers";
import Transactions from "./pages/admin/Transactions";
import Settings from "./pages/admin/Settings";
import PriceList from "./pages/PriceList";
import CategoryManager from "./pages/admin/CategoryManager";
import PriceAnalytics from "./pages/admin/PriceAnalytics";
import ProductList from "./pages/admin/ProductList";
import CategoryList from "./pages/admin/CategoryList";
import DescriptionManager from "./pages/admin/DescriptionManager";
import HistoryList from "./pages/admin/HistoryList";
import AdminUpdatePassword from "./pages/admin/AdminUpdatePassword";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminGST from "./pages/admin/AdminGST";
import AdminInventory from "./pages/admin/AdminInventory";
import Stores from "./pages/admin/Stores";
import Riders from "./pages/admin/Riders";
import Reports from "./pages/admin/Reports";
import Support from "./pages/admin/Support";
import BannerManager from "./pages/admin/BannerManager";
import AdminVendorApproval from "./pages/admin/AdminVendorApproval";
import CouponPage from "./pages/admin/CouponPage";
import AdminCategoryApproval from "./pages/admin/AdminCategoryApproval";
import ServiceAreas from "./pages/admin/ServiceAreas";
// 🔒 Private Route Wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ GLOBAL SCROLL RESET */}
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

                  <Route
  path="/invoice"
  element={
    <PrivateRoute>
      <InvoicePage />
    </PrivateRoute>
  }
/>


        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="stores" element={<Stores />} />
          <Route path="riders" element={<Riders />} />
          <Route path="brokers" element={<Brokers />} />
          <Route
  path="maintenance-settings"
  element={<MaintenanceSettings />}
/>
          <Route path="transactions" element={<Transactions />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/admin/ads" element={<AdvertisingBannerPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<BannerManager />} />
          <Route path="CategoryManager" element={<CategoryManager />} />
          <Route path="pricelist" element={<PriceList />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="priceanalytics" element={<PriceAnalytics />} />
          <Route path="categorylist" element={<CategoryList />} />
          <Route path="descriptionmanager" element={<DescriptionManager />} />
          <Route path="historylist" element={<HistoryList />} />
          <Route path="update-password" element={<AdminUpdatePassword />} />
          <Route path="gst" element={<AdminGST />} />
          <Route path="coupons" element={<CouponPage />} />
<Route path="estimate" element={<Estimateinvoicepage />} />
<Route
  path="/admin/service-areas"
  element={<ServiceAreas />}
/>

          <Route path="inventory" element={<AdminInventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<Support />} />
          <Route path="vendor-approval" element={<AdminVendorApproval />} />
            <Route path="category-approval" element={<AdminCategoryApproval />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
