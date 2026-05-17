import { useState, type FormEvent } from "react";
import { User, Bell, Shield, Database, Activity, Save } from "lucide-react";

export function Settings() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@barstock.com",
    role: "Administrator",
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReports: true,
    salesAlerts: false,
    systemUpdates: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleSavePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          {[
            { icon: User, label: "Profile Settings", active: true },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Shield, label: "Security", active: false },
            { icon: Database, label: "Database Backup", active: false },
            { icon: Activity, label: "Activity Logs", active: false },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all duration-200 ${
                  item.active
                    ? "border border-green-500/30 bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400"
                    : "border border-green-900/20 bg-gray-900/50 text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Profile Settings</h3>
                <p className="text-sm text-gray-400">Update your personal information</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  className="w-full cursor-not-allowed rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-500"
                  disabled
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
                <p className="text-sm text-gray-400">Manage your notification settings</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: "lowStock", label: "Low Stock Alerts", description: "Get notified when drinks are running low" },
                { key: "dailyReports", label: "Daily Reports", description: "Receive daily summary reports via email" },
                { key: "salesAlerts", label: "Sales Alerts", description: "Get notified about high-value sales" },
                { key: "systemUpdates", label: "System Updates", description: "Receive notifications about system updates" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-xl bg-gray-800/30 p-4">
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Security Settings</h3>
                <p className="text-sm text-gray-400">Change your password</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Current Password</label>
                <input
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">New Password</label>
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-3 font-medium text-white transition-all duration-200 hover:from-purple-500 hover:to-purple-600"
              >
                <Shield className="h-4 w-4" />
                Change Password
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Database Backup</h3>
                <p className="text-sm text-gray-400">Manage database backups</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Last Backup</span>
                  <span className="text-xs text-gray-400">2026-05-17 03:00 AM</span>
                </div>
                <div className="text-xs text-gray-400">Automatic daily backups enabled</div>
              </div>

              <button className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800">
                Create Manual Backup
              </button>
              <button className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800">
                View Backup History
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <p className="text-sm text-gray-400">View your recent account activity</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { action: "Password changed", time: "2 days ago", ip: "192.168.1.1" },
                { action: "Profile updated", time: "1 week ago", ip: "192.168.1.1" },
                { action: "Login successful", time: "2 weeks ago", ip: "192.168.1.2" },
              ].map((activity, index) => (
                <div key={index} className="rounded-xl border border-gray-700 bg-gray-800/30 p-3">
                  <div className="text-sm font-medium text-white">{activity.action}</div>
                  <div className="text-xs text-gray-400">
                    {activity.time} - IP: {activity.ip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
