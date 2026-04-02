import { Outlet } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import StoreFooter from "../components/shared/StoreFooter";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <Navbar />
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>

      <StoreFooter />
    </div>
  );
}
