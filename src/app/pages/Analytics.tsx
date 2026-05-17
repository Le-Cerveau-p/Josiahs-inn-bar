import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];

const emptyAnalytics = {
  summary: {
    totalRevenue: 0,
    salesQuantity: 0,
    bdQuantity: 0,
    hotelQuantity: 0,
    totalItems: 0,
    uniqueDrinks: 0,
  },
  byDrink: [],
  monthlyTrend: [],
  categoryData: [],
  weeklyOutingData: [],
};

function getRangeBounds(range: string) {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);

  if (range === "daily") {
    return { from: end, to: end };
  }

  if (range === "weekly") {
    const fromDate = new Date(today);
    fromDate.setDate(fromDate.getDate() - 6);
    return { from: fromDate.toISOString().slice(0, 10), to: end };
  }

  if (range === "yearly") {
    return { from: `${today.getFullYear()}-01-01`, to: end };
  }

  const from = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  return { from, to: end };
}

export function Analytics() {
  const { drinks, getAnalytics } = useBarData();
  const [dateRange, setDateRange] = useState("monthly");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [selectedDrink, setSelectedDrink] = useState("all");
  const [outingTypeFilter, setOutingTypeFilter] = useState("all");
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(false);

  const rangeBounds = useMemo(() => {
    if (dateRange === "custom") {
      return { from: customFrom || undefined, to: customTo || undefined };
    }
    return getRangeBounds(dateRange);
  }, [dateRange, customFrom, customTo]);

  useEffect(() => {
    if (dateRange === "custom" && (!customFrom || !customTo)) {
      return;
    }

    let active = true;
    setLoading(true);

    void getAnalytics({
      from: rangeBounds.from,
      to: rangeBounds.to,
      drinkId: selectedDrink,
      type: outingTypeFilter,
    })
      .then((payload) => {
        if (active) {
          setAnalytics(payload);
        }
      })
      .catch(() => {
        if (active) {
          setAnalytics(emptyAnalytics);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [rangeBounds.from, rangeBounds.to, selectedDrink, outingTypeFilter, getAnalytics, dateRange, customFrom, customTo]);

  const summaryCards = [
    {
      title: "Total Revenue",
      value: formatNaira(analytics.summary.totalRevenue),
      trend: "+22.8%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Sales Quantity",
      value: analytics.summary.salesQuantity.toLocaleString(),
      trend: "+15%",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Damaged & Broken Quantity",
      value: analytics.summary.bdQuantity.toLocaleString(),
      trend: "Month to date",
      icon: Award,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Hotel Refreshments",
      value: analytics.summary.hotelQuantity.toLocaleString(),
      trend: "Month to date",
      icon: TrendingDown,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const topDrink = analytics.byDrink[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-white">Analytics & Reports</h2>
          <p className="text-gray-400">Track performance and analyze trends</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              <Calendar className="mr-2 inline h-4 w-4" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Drink</label>
            <select
              value={selectedDrink}
              onChange={(e) => setSelectedDrink(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="all">All Drinks</option>
              {drinks.map((drink) => (
                <option key={drink.id} value={drink.id}>
                  {drink.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Outing Type</label>
            <select
              value={outingTypeFilter}
              onChange={(e) => setOutingTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="all">All Types</option>
              <option value="Sales">Sales</option>
              <option value="B&D">Damaged & Broken</option>
              <option value="Hotel Refreshment">Hotel Refreshment</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Custom Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${card.color} p-6`}>
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/20">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-white/80">{card.trend}</span>
              </div>
              <div className="mb-1 text-3xl font-bold text-white">{card.value}</div>
              <div className="text-sm text-white/80">{card.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
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
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#analyticsRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Sales and Outings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyTrend}>
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
              <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="bd" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="hotel" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white">Drink Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.categoryData.map((entry, index) => (
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
          <h3 className="mb-4 text-lg font-bold text-white">Weekly Movement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.weeklyOutingData}>
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
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="bd" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="hotel" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Drink Performance</h3>
            {loading && <span className="text-sm text-gray-400">Refreshing...</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Drink</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Qty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Revenue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                </tr>
              </thead>
              <tbody>
                {analytics.byDrink.length > 0 ? (
                  analytics.byDrink.map((item) => (
                    <tr key={item.drinkId} className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm font-medium text-white">{item.drinkName}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{item.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-green-400">{formatNaira(item.revenue)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-800/50 px-2 py-1 text-xs text-gray-300">{item.outingType}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-4 text-sm text-gray-400" colSpan={4}>
                      No analytics data for the selected range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-bold text-white">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Total Transactions</span>
                <span className="font-bold text-white">{analytics.summary.totalItems}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Unique Drinks</span>
                <span className="font-bold text-white">{analytics.summary.uniqueDrinks}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Top Drink</span>
                <span className="font-bold text-green-400">{topDrink ? topDrink.drinkName : "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-bold text-white">Reports</h3>
            <div className="space-y-3">
              <button className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-left transition-all hover:bg-gray-800">
                <div className="flex items-center gap-2 text-green-400">
                  <Download className="h-4 w-4" />
                  Export as PDF
                </div>
                <div className="text-sm text-gray-400">Download the selected report range</div>
              </button>
              <button className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-left transition-all hover:bg-gray-800">
                <div className="flex items-center gap-2 text-blue-400">
                  <Download className="h-4 w-4" />
                  Export as CSV
                </div>
                <div className="text-sm text-gray-400">Download raw analytics data</div>
              </button>
              <button className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-left transition-all hover:from-green-500 hover:to-emerald-500">
                <div className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-4 w-4" />
                  Generate Custom Report
                </div>
                <div className="text-sm text-green-100">Create a tailored analytics export</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
