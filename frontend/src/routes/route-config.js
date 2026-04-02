import { ROUTE_PATHS } from "./route-paths";

export const publicRoutes = [
  {
    path: ROUTE_PATHS.home,
    title: "Storefront Home",
    description: "Premium white-label storefront entry point.",
  },
  {
    path: ROUTE_PATHS.catalog,
    title: "Product Catalog",
    description: "Scalable collection grid with filters and category browsing.",
  },
  {
    path: ROUTE_PATHS.productDetail,
    title: "Product Detail",
    description: "High-conversion product presentation with gallery and purchase actions.",
  },
  {
    path: ROUTE_PATHS.cart,
    title: "Shopping Cart",
    description: "Clean cart flow prepared for quantity updates and summary logic.",
  },
  {
    path: ROUTE_PATHS.checkout,
    title: "Checkout",
    description: "Streamlined purchase experience with WhatsApp and reusable payment flows.",
  },
];

export const adminRoutes = [
  {
    path: ROUTE_PATHS.adminLogin,
    title: "Admin Login",
    description: "Secure access point for store administration.",
  },
  {
    path: ROUTE_PATHS.adminDashboard,
    title: "Admin Dashboard",
    description: "Operational overview for products, orders, categories, and store settings.",
  },
  {
    path: ROUTE_PATHS.adminProducts,
    title: "Products Manager",
    description: "Admin workspace for product creation, editing, and inventory control.",
  },
  {
    path: ROUTE_PATHS.adminCategories,
    title: "Categories Manager",
    description: "Category management flow for reusable storefront structures.",
  },
  {
    path: ROUTE_PATHS.adminOrders,
    title: "Orders Manager",
    description: "Order tracking and status management interface.",
  },
  {
    path: ROUTE_PATHS.adminStoreConfig,
    title: "Store Config",
    description: "Branding and commerce preferences for white-label deployments.",
  },
];
