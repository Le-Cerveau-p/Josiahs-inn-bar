import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  Bell,
  Database,
  RefreshCw,
  Save,
  Shield,
  ShieldCheck,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { api } from "../lib/api";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type SectionKey = "profile" | "users" | "notifications" | "security" | "backup" | "activity";

const emptyUserForm = {
  name: "",
  email: "",
  role: "user" as "admin" | "user",
};

export function Settings() {
  const sectionRefs = {
    profile: useRef<HTMLDivElement | null>(null),
    users: useRef<HTMLDivElement | null>(null),
    notifications: useRef<HTMLDivElement | null>(null),
    security: useRef<HTMLDivElement | null>(null),
    backup: useRef<HTMLDivElement | null>(null),
    activity: useRef<HTMLDivElement | null>(null),
  };

  const [activeSection, setActiveSection] = useState<SectionKey>("profile");
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@josiahinnbar.com",
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
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersMessage, setUsersMessage] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [userForm, setUserForm] = useState(emptyUserForm);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const payload = (await api.getUsers()) as ManagedUser[];
      setUsers(payload);

      const firstAdmin = payload.find((user) => user.role === "admin" && user.active);
      if (firstAdmin) {
        setProfile({
          name: firstAdmin.name,
          email: firstAdmin.email,
          role: "Administrator",
        });
      }
    } catch (error) {
      setUsers([]);
      setUsersError(error instanceof Error ? error.message : "Unable to load users");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const activeUsersCount = useMemo(() => users.filter((user) => user.active).length, [users]);
  const adminCount = useMemo(() => users.filter((user) => user.active && user.role === "admin").length, [users]);

  const sectionItems: Array<{ key: SectionKey; icon: typeof User; label: string }> = [
    { key: "profile", icon: User, label: "Profile Settings" },
    { key: "users", icon: Users, label: "User Management" },
    { key: "notifications", icon: Bell, label: "Notifications" },
    { key: "security", icon: Shield, label: "Security" },
    { key: "backup", icon: Database, label: "Database Backup" },
    { key: "activity", icon: Activity, label: "Activity Logs" },
  ];

  const scrollToSection = (key: SectionKey) => {
    setActiveSection(key);
    sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingUser(true);
    setUsersMessage(null);

    try {
      await api.createUser({
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
      });
      setUserForm(emptyUserForm);
      await loadUsers();
      setUsersMessage("User added successfully.");
      setActiveSection("users");
      sectionRefs.users.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setUsersMessage(error instanceof Error ? error.message : "Unable to create user.");
    } finally {
      setSavingUser(false);
    }
  };

  const toggleRole = async (user: ManagedUser) => {
    setBusyUserId(user.id);
    setUsersMessage(null);

    try {
      await api.updateUser(user.id, {
        role: user.role === "admin" ? "user" : "admin",
      });
      await loadUsers();
      setUsersMessage(`${user.name} updated.`);
    } catch (error) {
      setUsersMessage(error instanceof Error ? error.message : "Unable to update user.");
    } finally {
      setBusyUserId(null);
    }
  };

  const toggleActive = async (user: ManagedUser) => {
    setBusyUserId(user.id);
    setUsersMessage(null);

    try {
      await api.updateUser(user.id, {
        active: !user.active,
      });
      await loadUsers();
      setUsersMessage(`${user.name} updated.`);
    } catch (error) {
      setUsersMessage(error instanceof Error ? error.message : "Unable to update user.");
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400">Manage your account, users, and system preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-2 lg:sticky lg:top-24 lg:self-start">
          {sectionItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => scrollToSection(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all duration-200 ${
                  isActive
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
          <div ref={sectionRefs.users} id="settings-users" className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">User Management</h3>
                  <p className="text-sm text-gray-400">Add users and control admin access</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm text-gray-400">
                <span className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1">Active: {activeUsersCount}</span>
                <span className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1">Admins: {adminCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <form onSubmit={handleCreateUser} className="space-y-4 rounded-2xl border border-gray-700 bg-gray-800/30 p-5">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-green-400" />
                  <h4 className="text-base font-bold text-white">Add New User</h4>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as "admin" | "user" })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={savingUser}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingUser ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  {savingUser ? "Adding User..." : "Add User"}
                </button>

                {usersMessage && <p className="text-sm text-gray-300">{usersMessage}</p>}
                {usersError && <p className="text-sm text-red-400">{usersError}</p>}
              </form>

              <div className="rounded-2xl border border-gray-700 bg-gray-800/30 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                    <h4 className="text-base font-bold text-white">Manage Existing Users</h4>
                  </div>
                  {usersLoading && <span className="text-xs text-gray-400">Loading...</span>}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">User</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Role</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => {
                          const isBusy = busyUserId === user.id;
                          return (
                            <tr key={user.id} className="border-b border-gray-700/60">
                              <td className="px-3 py-3">
                                <div>
                                  <div className="font-medium text-white">{user.name}</div>
                                  <div className="text-xs text-gray-400">{user.email}</div>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs ${
                                    user.role === "admin"
                                      ? "bg-purple-500/20 text-purple-300"
                                      : "bg-gray-700/60 text-gray-300"
                                  }`}
                                >
                                  {user.role === "admin" ? "Admin" : "User"}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs ${
                                    user.active ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                                  }`}
                                >
                                  {user.active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleRole(user)}
                                    disabled={isBusy}
                                    className="rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {user.role === "admin" ? "Demote" : "Promote to Admin"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleActive(user)}
                                    disabled={isBusy}
                                    className="rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {user.active ? "Deactivate" : "Reactivate"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="px-3 py-4 text-sm text-gray-400" colSpan={4}>
                            {usersLoading ? "Loading users..." : "No users found."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {!usersLoading && users.length > 0 && (
                  <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900/40 p-3 text-xs text-gray-400">
                    Admin access can be promoted or removed without leaving this page.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div ref={sectionRefs.profile} id="settings-profile" className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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

          <div ref={sectionRefs.notifications} id="settings-notifications" className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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

          <div ref={sectionRefs.security} id="settings-security" className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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

          <div ref={sectionRefs.backup} id="settings-backup" className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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

          <div ref={sectionRefs.activity} id="settings-activity" className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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
