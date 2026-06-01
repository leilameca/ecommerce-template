import { BrowserRouter, Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminStoreConfigPage from "../pages/admin/AdminStoreConfigPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminCouponsPage from "../pages/admin/AdminCouponsPage";
import CartPage from "../pages/cart/CartPage";
import ProductCatalogPage from "../pages/catalog/ProductCatalogPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import CheckoutSuccessPage from "../pages/checkout/CheckoutSuccessPage";
import CheckoutCancelPage from "../pages/checkout/CheckoutCancelPage";
import HomePage from "../pages/home/HomePage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import ProtectedRoute from "./ProtectedRoute";
import RoutePlaceholder from "./RoutePlaceholder";
import { ROUTE_PATHS } from "./route-paths";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTE_PATHS.home} element={<HomePage />} />
          <Route path={ROUTE_PATHS.catalog} element={<ProductCatalogPage />} />
          <Route path={ROUTE_PATHS.cart} element={<CartPage />} />
          <Route path={ROUTE_PATHS.checkout} element={<CheckoutPage />} />
          <Route path={ROUTE_PATHS.checkoutSuccess} element={<CheckoutSuccessPage />} />
          <Route path={ROUTE_PATHS.checkoutCancel} element={<CheckoutCancelPage />} />
          <Route
            path={ROUTE_PATHS.productDetail}
            element={<ProductDetailPage />}
          />
        </Route>

        <Route path={ROUTE_PATHS.adminLogin} element={<AdminLoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path={ROUTE_PATHS.adminDashboard}
              element={<AdminDashboardPage />}
            />
            <Route
              path={ROUTE_PATHS.adminProducts}
              element={<AdminProductsPage />}
            />
            <Route
              path={ROUTE_PATHS.adminCategories}
              element={<AdminCategoriesPage />}
            />
            <Route path={ROUTE_PATHS.adminOrders} element={<AdminOrdersPage />} />
            <Route
              path={ROUTE_PATHS.adminStoreConfig}
              element={<AdminStoreConfigPage />}
            />
            <Route path={ROUTE_PATHS.adminUsers} element={<AdminUsersPage />} />
            <Route path={ROUTE_PATHS.adminCoupons} element={<AdminCouponsPage />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <RoutePlaceholder
              title="Page Not Found"
              description="The requested route is not part of the current storefront map."
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
