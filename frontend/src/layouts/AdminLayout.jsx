import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import LanguageSwitcher from "../components/shared/LanguageSwitcher";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import { useStoreConfig } from "../hooks/useStoreConfig";
import { ROUTE_PATHS } from "../routes/route-paths";

const getLinkClassName = ({ isActive }, isCollapsed) =>
  [
    "flex items-center border-l-2 px-3 py-2.5 text-sm transition-colors duration-200",
    isCollapsed ? "justify-center" : "justify-between",
    isActive
      ? "border-zinc-950 bg-zinc-100 text-zinc-950"
      : "border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
  ].join(" ");

function MenuToggleIcon() {
  return (
    <span className="flex flex-col gap-1.5">
      <span className="block h-0.5 w-4 bg-current" />
      <span className="block h-0.5 w-4 bg-current" />
      <span className="block h-0.5 w-4 bg-current" />
    </span>
  );
}

function CollapseIcon({ isCollapsed }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 transition-transform duration-200 ${
        isCollapsed ? "rotate-180" : ""
      }`}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function SidebarContent({
  isCollapsed,
  setIsMobileMenuOpen,
  user,
  logout,
  storeName,
  t,
  adminNavigation,
}) {
  return (
    <>
      <div className="border-b border-zinc-200/80 px-4 py-4">
        <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
          {t("admin_label")}
        </div>

        <div
          className={`mt-2 overflow-hidden transition-all duration-200 ${
            isCollapsed ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
          }`}
        >
          <div className="truncate text-base font-semibold tracking-[-0.03em] text-zinc-950">
            {storeName}
          </div>
          <div className="mt-1 truncate text-xs text-zinc-500">
            {user?.name} | {user?.role}
          </div>
        </div>
      </div>

      <nav className="grid gap-1 px-2 py-4">
        {adminNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={(navState) => getLinkClassName(navState, isCollapsed)}
            title={isCollapsed ? item.label : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="truncate">{isCollapsed ? item.label.slice(0, 1) : item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-zinc-200/80 px-4 py-4">
        <div className="flex flex-col gap-3">
          {!isCollapsed ? (
            <Link
              to={ROUTE_PATHS.home}
              className="text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-950"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("admin_back_to_store")}
            </Link>
          ) : null}

          <Button
            variant="secondary"
            className="w-full"
            onClick={logout}
            title={isCollapsed ? "Logout" : undefined}
          >
            {isCollapsed ? "Exit" : t("admin_logout")}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { config } = useStoreConfig();
  const adminNavigation = [
    { label: t("admin_overview"), to: ROUTE_PATHS.adminDashboard, end: true },
    { label: t("admin_products"), to: ROUTE_PATHS.adminProducts },
    { label: t("admin_categories"), to: ROUTE_PATHS.adminCategories },
    { label: t("admin_orders"), to: ROUTE_PATHS.adminOrders },
    { label: t("admin_store_config"), to: ROUTE_PATHS.adminStoreConfig },
    { label: t("admin_coupons_nav"), to: ROUTE_PATHS.adminCoupons },
    ...(user?.role === "super-admin" ? [{ label: "Users", to: ROUTE_PATHS.adminUsers }] : []),
  ];
  const sidebarWidthClass = isSidebarCollapsed ? "xl:w-[88px]" : "xl:w-[272px]";
  const contentPaddingClass = isSidebarCollapsed ? "xl:pl-[112px]" : "xl:pl-[296px]";

  return (
    <div className="min-h-screen overflow-x-clip bg-zinc-100 text-zinc-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden overflow-y-auto border-r border-zinc-200/80 bg-white transition-[width] duration-200 xl:flex xl:flex-col ${sidebarWidthClass}`}
      >
        <div className="flex items-center justify-end border-b border-zinc-200/80 px-4 py-3">
          <div className="flex items-center gap-2">
            {!isSidebarCollapsed ? <LanguageSwitcher compact /> : null}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center border border-zinc-300 text-zinc-900"
              aria-label={isSidebarCollapsed ? "Open sidebar" : "Collapse sidebar"}
              onClick={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
            >
              <CollapseIcon isCollapsed={isSidebarCollapsed} />
            </button>
          </div>
        </div>

        <SidebarContent
          isCollapsed={isSidebarCollapsed}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          logout={logout}
          storeName={config.storeName || "Commerce Studio"}
          t={t}
          adminNavigation={adminNavigation}
        />
      </aside>

      <div className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/95 px-3.5 py-3 backdrop-blur sm:px-5 xl:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
              {t("admin_label")}
            </div>
            <div className="truncate text-base font-semibold tracking-[-0.03em] text-zinc-950">
              {config.storeName || "Commerce Studio"}
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-zinc-300 text-zinc-900"
            aria-label="Toggle admin menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
          >
            <MenuToggleIcon />
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close admin menu overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-r border-zinc-200/80 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="text-base font-semibold tracking-[-0.03em] text-zinc-950">
                  {t("admin_menu")}
                </div>
                <LanguageSwitcher compact />
              </div>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center border border-zinc-300 text-zinc-900"
                aria-label="Close admin menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CollapseIcon isCollapsed={false} />
              </button>
            </div>

            <SidebarContent
              isCollapsed={false}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              user={user}
              logout={logout}
              storeName={config.storeName || "Commerce Studio"}
              t={t}
              adminNavigation={adminNavigation}
            />
          </aside>
        </div>
      ) : null}

      <div className={`transition-[padding] duration-200 ${contentPaddingClass}`}>
        <main className="min-w-0 p-3 sm:p-5 xl:p-6">
          <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 sm:p-5 xl:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
