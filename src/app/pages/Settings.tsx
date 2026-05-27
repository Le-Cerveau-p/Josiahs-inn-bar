import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  Bell,
  Edit,
  RefreshCw,
  Save,
  Shield,
  ShieldCheck,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { api } from "../lib/api";
import { mockUsers } from "../data/mockData";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type SectionKey = "profile" | "users" | "notifications" | "security" | "activity";
type UserFormState = {
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
  password: string;
  confirmPassword: string;
};

const emptyUserForm: UserFormState = {
  name: "",
  email: "",
  role: "user",
  active: true,
  password: "",
  confirmPassword: "",
};

export function Settings() {
  const profileRef = useRef<HTMLDivElement | null>(null);
  const usersRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const securityRef = useRef<HTMLDivElement | null>(null);
  const activityRef = useRef<HTMLDivElement | null>(null);

  const sectionOrder = useMemo(
    () => [
      { key: "profile" as const, ref: profileRef, label: "Profile Settings" },
      { key: "users" as const, ref: usersRef, label: "User Management" },
      { key: "notifications" as const, ref: notificationsRef, label: "Notifications" },
      { key: "security" as const, ref: securityRef, label: "Security" },
      { key: "activity" as const, ref: activityRef, label: "Activity Logs" },
    ],
    [],
  );

  const [activeSection, setActiveSection] = useState<SectionKey>("profile");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersMessage, setUsersMessage] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);
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

  const selectedUser = useMemo(
    () => (selectedUserId && selectedUserId !== "new" ? users.find((user) => user.id === selectedUserId) ?? null : null),
    [selectedUserId, users],
  );

  const syncEditorFromUser = useCallback((user: ManagedUser | null) => {
    if (!user) {
      setUserForm(emptyUserForm);
      return;
    }

    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: "",
      confirmPassword: "",
    });
  }, []);

  const makeUserId = useCallback(() => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `demo-${Date.now()}`;
  }, []);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const payload = (await api.getUsers()) as ManagedUser[];
      setUsers(payload);
      setDemoMode(false);
      setUsersMessage(null);
    } catch (error) {
      setDemoMode(true);
      setUsers(mockUsers as ManagedUser[]);
      setUsersError(null);
      setUsersMessage("Demo users are loaded locally because the API is unavailable.");
      console.warn("Falling back to local user demo data because the API is unavailable.", error);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    syncEditorFromUser(selectedUser);
  }, [selectedUser, syncEditorFromUser]);

  useEffect(() => {
    if (selectedUserId === "" && users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  useEffect(() => {
    const updateActiveSection = () => {
      const anchor = 180;
      const visible = sectionOrder.filter(({ ref }) => {
        const element = ref.current;
        if (!element) return false;
        return element.getBoundingClientRect().top <= anchor;
      });

      const nextSection = visible.length > 0 ? visible[visible.length - 1].key : sectionOrder[0].key;
      setActiveSection((current) => (current === nextSection ? current : nextSection));
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sectionOrder]);

  const activeUsersCount = useMemo(() => users.filter((user) => user.active).length, [users]);
  const adminCount = useMemo(() => users.filter((user) => user.active && user.role === "admin").length, [users]);

  const navigateToSection = (key: SectionKey) => {
    setActiveSection(key);
    const target = sectionOrder.find((item) => item.key === key)?.ref.current;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectUserForEditing = (user: ManagedUser) => {
    setSelectedUserId(user.id);
    setActiveSection("profile");
    profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetToNewUser = () => {
    setSelectedUserId("new");
    syncEditorFromUser(null);
    setActiveSection("profile");
    profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const handleSaveUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingUser(true);
    setUsersMessage(null);

    try {
      const password = userForm.password.trim();
      const confirmPassword = userForm.confirmPassword.trim();
      const editingExisting = Boolean(selectedUser);

      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
      } else if (!editingExisting) {
        throw new Error("Password is required for new users.");
      }

      const payload = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        active: userForm.active,
        ...(password ? { password } : {}),
      };

      if (demoMode) {
        if (editingExisting) {
          const updatedAt = new Date().toISOString();
          setUsers((current) =>
            current.map((user) =>
              user.id === selectedUser!.id
                ? {
                    ...user,
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                    active: payload.active,
                    updatedAt,
                  }
                : user,
            ),
          );
          setUsersMessage("User updated successfully in demo mode.");
        } else {
          const created: ManagedUser = {
            id: makeUserId(),
            name: payload.name,
            email: payload.email,
            role: payload.role,
            active: payload.active,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUsers((current) => [created, ...current]);
          setSelectedUserId(created.id);
          setUsersMessage("User added successfully in demo mode.");
        }
        return;
      }

      if (editingExisting) {
        await api.updateUser(selectedUser!.id, payload);
        setUsersMessage("User updated successfully.");
      } else {
        const created = (await api.createUser(payload)) as ManagedUser;
        setSelectedUserId(created.id);
        setUsersMessage("User added successfully.");
      }

      await loadUsers();
    } catch (error) {
      setUsersMessage(error instanceof Error ? error.message : "Unable to save user.");
    } finally {
      setSavingUser(false);
    }
  };

  const toggleRole = async (user: ManagedUser) => {
    setBusyUserId(user.id);
    setUsersMessage(null);

    try {
      if (demoMode) {
        setUsers((current) =>
          current.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  role: item.role === "admin" ? "user" : "admin",
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        );
        setUsersMessage(`${user.name} updated in demo mode.`);
        return;
      }

      await api.updateUser(user.id, { role: user.role === "admin" ? "user" : "admin" });
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
      if (demoMode) {
        setUsers((current) =>
          current.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  active: !item.active,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        );
        setUsersMessage(`${user.name} updated in demo mode.`);
        return;
      }

      await api.updateUser(user.id, { active: !user.active });
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
          {sectionOrder.map((item) => {
            const Icon = item.key === "profile" ? User : item.key === "users" ? Users : item.key === "notifications" ? Bell : item.key === "security" ? Shield : Activity;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigateToSection(item.key)}
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
          <div ref={profileRef} id="profile" className="scroll-mt-24 rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedUser ? "Edit User Profile" : "Create New User"}</h3>
                  <p className="text-sm text-gray-400">Select a user, then update their details and password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetToNewUser}
                className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800"
              >
                <UserPlus className="h-4 w-4" />
                New User
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Select User</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "new") {
                      resetToNewUser();
                      return;
                    }
                    setSelectedUserId(value);
                  }}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="">Select a user...</option>
                  <option value="new">Create New User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} {user.active ? "" : "(Inactive)"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-4 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Active users</span>
                  <span className="font-medium text-white">{activeUsersCount}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Admin users</span>
                  <span className="font-medium text-white">{adminCount}</span>
                </div>
                <p className="mt-3 text-xs text-gray-500">Leave password blank when editing if you do not want to change it.</p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Status</label>
                  <select
                    value={userForm.active ? "active" : "inactive"}
                    onChange={(e) => setUserForm({ ...userForm, active: e.target.value === "active" })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Password {selectedUser ? "(leave blank to keep current)" : "(required)"}
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder={selectedUser ? "Optional password change" : "Enter password"}
                    required={!selectedUser}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Confirm Password</label>
                  <input
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Confirm password"
                    required={!selectedUser}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingUser}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingUser ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {savingUser ? "Saving..." : selectedUser ? "Update User" : "Add User"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedUser) {
                      syncEditorFromUser(selectedUser);
                    } else {
                      resetToNewUser();
                    }
                  }}
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-5 py-3 font-medium text-white transition-all hover:bg-gray-800"
                >
                  Reset
                </button>
              </div>

              {usersMessage && <p className="text-sm text-gray-300">{usersMessage}</p>}
              {usersError && <p className="text-sm text-red-400">{usersError}</p>}
            </form>
          </div>

          <div ref={usersRef} id="users" className="scroll-mt-24 rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">User Management</h3>
                <p className="text-sm text-gray-400">Review users and open them in the editor above</p>
              </div>
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
                                user.role === "admin" ? "bg-purple-500/20 text-purple-300" : "bg-gray-700/60 text-gray-300"
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
                                onClick={() => selectUserForEditing(user)}
                                className="rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-gray-800"
                              >
                                <Edit className="mr-1 inline h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleRole(user)}
                                disabled={isBusy}
                                className="rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {user.role === "admin" ? "Demote" : "Promote"}
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
                Use Edit to load a user into the profile section, then update the details or password there.
              </div>
            )}
          </div>

          <div ref={notificationsRef} id="notifications" className="scroll-mt-24 rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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

          <div ref={securityRef} id="security" className="scroll-mt-24 rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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

          <div ref={activityRef} id="activity" className="scroll-mt-24 rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
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
