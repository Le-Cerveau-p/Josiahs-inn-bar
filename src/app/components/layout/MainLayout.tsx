import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ArrowUpRight,
  BarChart3,
  Wine,
  Settings,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/stocking", label: "Stocking", icon: PackagePlus },
  { path: "/outing", label: "Outing", icon: ArrowUpRight },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/drinks", label: "Drink Management", icon: Wine },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLabel = navItems.find((item) => item.path === location.pathname)?.label ?? "Dashboard";

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-green-900/20 bg-gray-900/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-green-900/20 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Wine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Josiah inn bar</h1>
                <p className="text-xs text-gray-400">Inventory control</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                    isActive
                      ? "border border-green-500/30 bg-green-500/10 text-green-300"
                      : "text-gray-400 hover:bg-gray-800/70 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-green-900/20 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-800/60 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">Admin User</p>
                <p className="truncate text-xs text-gray-400">admin@barstock.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-green-900/20 bg-gray-900/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((value) => !value)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800/80 hover:text-white lg:hidden"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">{activeLabel}</h2>
                <p className="text-xs text-gray-400">Bar stock and sales operations</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800/80 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" />
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-emerald-500"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
