import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Coffee,
  Wine as WineIcon,
  Plus,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useBarData } from "../context/BarDataContext";
import { formatNaira } from "../lib/currency";
import { categoryData as fallbackCategoryData, mockActivities, mockDrinks, salesChartData, weeklyOutingData } from "../data/mockData";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];

export function Dashboard() {
  const { dashboard } = useBarData();

  const monthlySales = dashboard?.salesChartData.length ? dashboard.salesChartData : salesChartData;
  const categoryBreakdown = dashboard?.categoryData.length ? dashboard.categoryData : fallbackCategoryData;
  const weeklyBreakdown = dashboard?.weeklyOutingData.length ? dashboard.weeklyOutingData : weeklyOutingData;
  const recentActivities = dashboard?.recentActivities.length ? dashboard.recentActivities : mockActivities;
  const lowStockDrinks = dashboard?.lowStockDrinks.length
    ? dashboard.lowStockDrinks
    : mockDrinks.filter((drink) => drink.status === "Low Stock");

  const statCards = [
    {
      title: "Total Drinks in Inventory",
      value: dashboard ? dashboard.stats.totalInventory.toString() : mockDrinks.reduce((acc, drink) => acc + drink.quantity, 0).toString(),
      trend: "+12.5%",
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Sales Today",
      value: dashboard?.stats.totalSalesToday ?? formatNaira(2847),
      trend: "+8.2%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Monthly Revenue",
      value: dashboard?.stats.monthlyRevenue ?? formatNaira(71800),
      trend: "+22.8%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Low Stock Drinks",
      value: dashboard ? dashboard.stats.lowStockDrinks.toString() : mockDrinks.filter((drink) => drink.status === "Low Stock").length.toString(),
      trend: "-3 items",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Hotel Refreshments",
      value: dashboard?.stats.hotelRefreshments.toString() ?? "127",
      trend: "+15.3%",
      icon: Coffee,
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Damaged & Broken Count",
      value: dashboard?.stats.bdCount.toString() ?? "43",
      trend: "+5.1%",
      icon: WineIcon,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl transition-all duration-200 hover:border-green-500/30"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-400">{stat.trend}</span>
              </div>
              <div className="mb-1 text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #10b981",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Drink Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #10b981",
                  borderRadius: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Weekly Outing</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #10b981",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#10b981" />
              <Bar dataKey="bd" fill="#3b82f6" />
              <Bar dataKey="hotel" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #10b981",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl lg:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-white">Recent Activities</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Drink</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-gray-300">{activity.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          activity.type === "Sales"
                            ? "bg-green-500/20 text-green-400"
                            : activity.type === "Stocking"
                            ? "bg-blue-500/20 text-blue-400"
                            : activity.type === "B&D"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {activity.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{activity.drinkName}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{activity.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{activity.user}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">{activity.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-orange-900/30 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Low Stock Alert
            </h3>
            <div className="space-y-3">
              {lowStockDrinks.map((drink) => (
                <div key={drink.id} className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                  <div>
                    <div className="text-sm font-medium text-white">{drink.name}</div>
                    <div className="text-xs text-gray-400">{drink.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-400">{drink.quantity}</div>
                    <div className="text-xs text-gray-400">remaining</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-bold text-white">Quick Actions</h3>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500">
                <Plus className="h-4 w-4" />
                Add Stock
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800">
                <ArrowUpRight className="h-4 w-4" />
                Record Sales
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                Add New Drink
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800">
                <FileText className="h-4 w-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
