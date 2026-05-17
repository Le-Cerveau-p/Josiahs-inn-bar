import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Wine, Lock, Mail } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-2 items-center">
        <div className="hidden flex-col justify-center space-y-6 lg:flex">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/50">
              <Wine className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Josiah inn bar</h1>
              <p className="text-green-400">Inventory Management System</p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Manage your bar inventory with ease</h2>
            <p className="text-lg text-gray-400">
              Track stock levels, monitor sales, analyze trends, and keep the bar running from one place.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-green-900/20 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 lg:hidden">
                <Wine className="h-6 w-6 text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3 pl-11 pr-4 text-white placeholder-gray-500 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3 pl-11 pr-4 text-white placeholder-gray-500 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-green-500 focus:ring-green-500/50 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-green-400 transition-colors hover:text-green-300">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:from-green-500 hover:to-emerald-500"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <a href="#" className="text-green-400 transition-colors hover:text-green-300">
                  Contact Admin
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
