import { Outlet } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import StoreFooter from "../components/shared/StoreFooter";

export default function PublicLayout() {
  return (
    <div className="min-h-screen overflow-x-clip text-zinc-950" style={{ backgroundColor: "var(--color-background, #ffffff)" }}>
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 backdrop-blur-xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-background, #ffffff) 92%, transparent)" }}>
        <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-10">
          <Navbar />
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-[1440px] px-3.5 py-3 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>

      <StoreFooter />
    </div>
  );
}
