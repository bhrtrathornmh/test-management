import { Link, useLocation } from "react-router-dom";
import { TrendingUp, SquarePen, BookSearchIcon, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: TrendingUp, matchPrefix: "/dashboard" },
  { to: "/tests/new", label: "Test Creation", icon: SquarePen, matchPrefix: "/tests" },
  { to: "/tracking", label: "Test Tracking", icon: BookSearchIcon, matchPrefix: "/tracking" },
];

export function Sidebar() {
  const location = useLocation();
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <>
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 transition-transform duration-200 ease-out",
          "lg:static lg:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2 pb-8">
          <Logo />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.matchPrefix);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary-500 bg-primary-50 text-primary-600"
                    : "border-transparent text-slate-500 hover:bg-slate-50",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
