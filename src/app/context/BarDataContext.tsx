import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import {
  buildCategoryData,
  buildMonthlyOutingData,
  buildWeeklyOutingData,
  getDrinkStatus,
  isWithinRange,
  type OutingEntry,
  type PriceChangeEntry,
  type PriceChangeSummary,
  type StockEntry,
} from "../lib/analytics";
import { formatNaira } from "../lib/currency";
import {
  mockDrinks,
  mockOutingEntries,
  mockPriceChanges,
  mockStockEntries,
  salesChartData,
  type Drink,
  type OutingType,
} from "../data/mockData";

type StockItemInput = {
  drinkId: string;
  quantity: number;
  supplier: string;
  notes?: string;
};

type OutingItemInput = {
  drinkId: string;
  quantity: number;
};

type DrinkInput = {
  name: string;
  category: Drink["category"];
  costPrice: number;
  sellingPrice: number;
  quantity?: number;
  active?: boolean;
};

type DashboardPayload = {
  stats: {
    totalInventory: number;
    totalSalesToday: string;
    monthlyRevenue: string;
    lowStockDrinks: number;
    hotelRefreshments: number;
    bdCount: number;
  };
  recentActivities: Array<{
    id: string;
    date: string;
    type: string;
    drinkName: string;
    quantity: number;
    user: string;
    status: string;
  }>;
  lowStockDrinks: Drink[];
  categoryData: Array<{ name: string; value: number }>;
  salesChartData: Array<{ month: string; sales: number; revenue: number }>;
  weeklyOutingData: Array<{ day: string; sales: number; bd: number; hotel: number }>;
};

type AnalyticsPayload = {
  summary: {
    totalRevenue: number;
    totalCost: number;
    profit: number;
    loss: number;
    netProfitLoss: number;
    salesQuantity: number;
    bdQuantity: number;
    hotelQuantity: number;
    totalItems: number;
    uniqueDrinks: number;
  };
  byDrink: Array<{
    drinkId: string;
    drinkName: string;
    quantity: number;
    salesQuantity: number;
    revenue: number;
    cost: number;
    profit: number;
    loss: number;
    netProfitLoss: number;
    outingType: OutingType | "All";
  }>;
  monthlyTrend: Array<{
    month: string;
    sales: number;
    bd: number;
    hotel: number;
    revenue: number;
    cost: number;
    profit: number;
    loss: number;
    netProfitLoss: number;
  }>;
  categoryData: Array<{ name: string; value: number }>;
  weeklyOutingData: Array<{ day: string; sales: number; bd: number; hotel: number }>;
  priceChanges: PriceChangeEntry[];
  priceChangeSummary: PriceChangeSummary;
};

type BarDataContextValue = {
  drinks: Drink[];
  stockEntries: StockEntry[];
  outingEntries: OutingEntry[];
  dashboard: DashboardPayload | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createDrink: (input: DrinkInput) => Promise<void>;
  updateDrink: (id: string, input: Partial<DrinkInput>) => Promise<void>;
  deleteDrink: (id: string) => Promise<void>;
  createStockEntry: (input: { date: string; notes?: string; items: StockItemInput[] }) => Promise<void>;
  createOutingEntry: (input: { date: string; type: OutingType; notes?: string; items: OutingItemInput[] }) => Promise<void>;
  getAnalytics: (filters: { from?: string; to?: string; drinkId?: string; type?: string }) => Promise<AnalyticsPayload>;
};

const BarDataContext = createContext<BarDataContextValue | null>(null);

function normalizeDrink(drink: Drink): Drink {
  const sellingPrice = Number.isFinite(drink.sellingPrice) ? drink.sellingPrice : drink.unitPrice;
  const costPrice = Number.isFinite(drink.costPrice) ? drink.costPrice : Number((sellingPrice * 0.75).toFixed(2));

  return {
    ...drink,
    unitPrice: sellingPrice,
    sellingPrice,
    costPrice,
    status: drink.quantity <= 0 ? "Out of Stock" : drink.quantity <= 15 ? "Low Stock" : "In Stock",
  };
}

function buildDemoRecentActivities() {
  const stockActivities = mockStockEntries.flatMap((entry) =>
    entry.items.map((item) => ({
      id: `${entry.id}:${item.id}`,
      date: `${entry.date} 09:00`,
      type: "Stocking" as const,
      drinkName: item.drinkName,
      quantity: item.quantity,
      user: "Inventory Clerk",
      status: "Completed" as const,
    })),
  );

  const outingActivities = mockOutingEntries.flatMap((entry) =>
    entry.items.map((item) => ({
      id: `${entry.id}:${item.id}`,
      date: `${entry.date} 12:00`,
      type: entry.type,
      drinkName: item.drinkName,
      quantity: item.quantity,
      user: entry.type === "Sales" ? "Floor Supervisor" : "Admin User",
      status: "Completed" as const,
    })),
  );

  return [...stockActivities, ...outingActivities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
}

function buildDemoDashboard() {
  const monthPrefix = "2026-05";
  const salesEntries = mockOutingEntries.filter((entry) => entry.type === "Sales");
  const latestSalesEntry = [...salesEntries].sort((a, b) => b.date.localeCompare(a.date))[0];
  const monthSales = mockOutingEntries
    .filter((entry) => entry.date.startsWith(monthPrefix) && entry.type === "Sales")
    .flatMap((entry) => entry.items)
    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const monthRevenue = monthSales;
  const totalInventory = mockDrinks.reduce((sum, drink) => sum + drink.quantity, 0);
  const monthlyChart = buildMonthlyOutingData(mockOutingEntries as unknown as OutingEntry[]).map((item) => ({
    month: item.month,
    sales: item.sales,
    revenue: item.revenue,
  }));

  return {
    stats: {
      totalInventory,
      totalSalesToday: formatNaira(
        latestSalesEntry ? latestSalesEntry.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) : 0,
      ),
      monthlyRevenue: formatNaira(monthRevenue),
      lowStockDrinks: mockDrinks.filter((drink) => drink.status === "Low Stock").length,
      hotelRefreshments: mockOutingEntries
        .filter((entry) => entry.date.startsWith(monthPrefix) && entry.type === "Hotel Refreshment")
        .flatMap((entry) => entry.items)
        .reduce((sum, item) => sum + item.quantity, 0),
      bdCount: mockOutingEntries
        .filter((entry) => entry.date.startsWith(monthPrefix) && entry.type === "B&D")
        .flatMap((entry) => entry.items)
        .reduce((sum, item) => sum + item.quantity, 0),
    },
    recentActivities: buildDemoRecentActivities(),
    lowStockDrinks: mockDrinks.filter((drink) => drink.status === "Low Stock"),
    categoryData: buildCategoryData(mockDrinks),
    salesChartData: monthlyChart.length > 0 ? monthlyChart : salesChartData,
    weeklyOutingData: buildWeeklyOutingData(mockOutingEntries as unknown as OutingEntry[]),
  };
}

function buildDemoAnalytics(filters: { from?: string; to?: string; drinkId?: string; type?: string }): AnalyticsPayload {
  const from = filters.from ?? "0000-01-01";
  const to = filters.to ?? "9999-12-31";
  const drinkId = filters.drinkId && filters.drinkId !== "all" ? filters.drinkId : undefined;
  const outingType = filters.type && filters.type !== "all" ? filters.type : undefined;

  const filteredOutings = mockOutingEntries.filter((entry) => {
    if (!isWithinRange(entry.date, from, to)) return false;
    if (outingType && entry.type !== outingType) return false;
    if (drinkId) {
      return entry.items.some((item) => item.drinkId === drinkId);
    }
    return true;
  });

  const filteredPriceChanges = mockPriceChanges.filter((change) => {
    if (!isWithinRange(change.changedAt, from, to)) return false;
    if (drinkId) {
      return change.drinkId === drinkId;
    }
    return true;
  });

  const byDrink = new Map<string, AnalyticsPayload["byDrink"][number]>();
  const monthly = new Map<
    string,
    {
      month: string;
      sales: number;
      bd: number;
      hotel: number;
      revenue: number;
      cost: number;
      profit: number;
      loss: number;
      netProfitLoss: number;
    }
  >();
  const weekly = new Map<
    number,
    {
      day: string;
      sales: number;
      bd: number;
      hotel: number;
      revenue: number;
      cost: number;
      profit: number;
      loss: number;
      netProfitLoss: number;
    }
  >();

  const summary = {
    totalRevenue: 0,
    totalCost: 0,
    profit: 0,
    loss: 0,
    netProfitLoss: 0,
    salesQuantity: 0,
    bdQuantity: 0,
    hotelQuantity: 0,
    totalItems: 0,
    uniqueDrinks: 0,
  };
  const drinkIds = new Set<string>();

  filteredOutings.forEach((entry) => {
    const entryItems = entry.items.filter((item) => (drinkId ? item.drinkId === drinkId : true));
    if (entryItems.length === 0) return;

    const monthKey = entry.date.slice(0, 7);
    const monthRecord = monthly.get(monthKey) ?? {
      month: monthKey,
      sales: 0,
      bd: 0,
      hotel: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
      loss: 0,
      netProfitLoss: 0,
    };
    const dayIndex = new Date(`${entry.date}T12:00:00Z`).getUTCDay();
    const weeklyRecord = weekly.get(dayIndex) ?? {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex],
      sales: 0,
      bd: 0,
      hotel: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
      loss: 0,
      netProfitLoss: 0,
    };
    const entryQuantity = entryItems.reduce((sum, item) => sum + item.quantity, 0);

    summary.totalItems += entryItems.length;

    if (entry.type === "Sales") {
      summary.salesQuantity += entryQuantity;
      monthRecord.sales += entryQuantity;
      weeklyRecord.sales += entryQuantity;
    } else if (entry.type === "B&D") {
      summary.bdQuantity += entryQuantity;
      monthRecord.bd += entryQuantity;
      weeklyRecord.bd += entryQuantity;
    } else {
      summary.hotelQuantity += entryQuantity;
      monthRecord.hotel += entryQuantity;
      weeklyRecord.hotel += entryQuantity;
    }

    entryItems.forEach((item) => {
      const itemRevenue = entry.type === "Sales" ? item.quantity * item.unitPrice : 0;
      const itemCost = item.quantity * item.costPrice;
      const margin = itemRevenue - itemCost;

      summary.totalRevenue += itemRevenue;
      summary.totalCost += itemCost;
      summary.netProfitLoss += margin;

      if (margin >= 0) {
        summary.profit += margin;
      } else {
        summary.loss += Math.abs(margin);
      }

      monthRecord.revenue += itemRevenue;
      monthRecord.cost += itemCost;
      monthRecord.netProfitLoss += margin;
      if (margin >= 0) {
        monthRecord.profit += margin;
      } else {
        monthRecord.loss += Math.abs(margin);
      }

      weeklyRecord.revenue += itemRevenue;
      weeklyRecord.cost += itemCost;
      weeklyRecord.netProfitLoss += margin;
      if (margin >= 0) {
        weeklyRecord.profit += margin;
      } else {
        weeklyRecord.loss += Math.abs(margin);
      }

      const current = byDrink.get(item.drinkId) ?? {
        drinkId: item.drinkId,
        drinkName: item.drinkName,
        quantity: 0,
        salesQuantity: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
        loss: 0,
        netProfitLoss: 0,
        outingType: outingType ?? "All",
      };

      current.quantity += item.quantity;
      if (entry.type === "Sales") {
        current.salesQuantity += item.quantity;
      }
      current.revenue += itemRevenue;
      current.cost += itemCost;
      current.netProfitLoss += margin;
      if (margin >= 0) {
        current.profit += margin;
      } else {
        current.loss += Math.abs(margin);
      }

      byDrink.set(item.drinkId, current);
      drinkIds.add(item.drinkId);
    });

    monthly.set(monthKey, monthRecord);
    weekly.set(dayIndex, weeklyRecord);
  });

  const priceChangeSummary = filteredPriceChanges.reduce(
    (acc, change) => {
      acc.updates += 1;
      acc.affectedDrinks.add(change.drinkId);
      if (change.inventoryImpact >= 0) {
        acc.positiveImpact += change.inventoryImpact;
      } else {
        acc.negativeImpact += Math.abs(change.inventoryImpact);
      }
      acc.netImpact += change.inventoryImpact;
      return acc;
    },
    {
      updates: 0,
      positiveImpact: 0,
      negativeImpact: 0,
      netImpact: 0,
      affectedDrinks: new Set<string>(),
    },
  );

  summary.uniqueDrinks = drinkIds.size;

  return {
    summary,
    byDrink: Array.from(byDrink.values()).sort((a, b) => b.netProfitLoss - a.netProfitLoss),
    monthlyTrend: Array.from(monthly.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value),
    categoryData: buildCategoryData(mockDrinks),
    weeklyOutingData: Array.from(weekly.values()).sort((a, b) => {
      const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return order.indexOf(a.day) - order.indexOf(b.day);
    }),
    priceChanges: filteredPriceChanges,
    priceChangeSummary: {
      updates: priceChangeSummary.updates,
      positiveImpact: Number(priceChangeSummary.positiveImpact.toFixed(2)),
      negativeImpact: Number(priceChangeSummary.negativeImpact.toFixed(2)),
      netImpact: Number(priceChangeSummary.netImpact.toFixed(2)),
      affectedDrinks: priceChangeSummary.affectedDrinks.size,
    },
  };
}

export function BarDataProvider({ children }: { children: ReactNode }) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [outingEntries, setOutingEntries] = useState<OutingEntry[]>([]);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [drinkData, stockData, outingData, dashboardData] = await Promise.all([
        api.getDrinks(),
        api.getStockEntries(),
        api.getOutingEntries(),
        api.getDashboard(),
      ]);

      setDrinks((drinkData as Drink[]).map(normalizeDrink));
      setStockEntries(stockData as StockEntry[]);
      setOutingEntries(outingData as OutingEntry[]);
      setDashboard(dashboardData as DashboardPayload);
    } catch (err) {
      console.warn("Falling back to local seed data because the API is unavailable.", err);
      setDrinks(mockDrinks.map(normalizeDrink));
      setStockEntries(mockStockEntries as StockEntry[]);
      setOutingEntries(mockOutingEntries as OutingEntry[]);
      setDashboard(buildDemoDashboard());
      setError(err instanceof Error ? err.message : "Unable to connect to the API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createDrink = useCallback(async (input: DrinkInput) => {
    await api.createDrink(input);
    await refresh();
  }, [refresh]);

  const updateDrink = useCallback(async (id: string, input: Partial<DrinkInput>) => {
    await api.updateDrink(id, input);
    await refresh();
  }, [refresh]);

  const deleteDrink = useCallback(async (id: string) => {
    await api.deleteDrink(id);
    await refresh();
  }, [refresh]);

  const createStockEntry = useCallback(async (input: { date: string; notes?: string; items: StockItemInput[] }) => {
    await api.createStockEntry(input);
    await refresh();
  }, [refresh]);

  const createOutingEntry = useCallback(async (input: { date: string; type: OutingType; notes?: string; items: OutingItemInput[] }) => {
    await api.createOutingEntry(input);
    await refresh();
  }, [refresh]);

  const getAnalytics = useCallback(async (filters: { from?: string; to?: string; drinkId?: string; type?: string }) => {
    try {
      return (await api.getAnalytics(filters)) as AnalyticsPayload;
    } catch (error) {
      console.warn("Using local analytics demo data because the API is unavailable.", error);
      return buildDemoAnalytics(filters);
    }
  }, []);

  const value = useMemo<BarDataContextValue>(
    () => ({
      drinks,
      stockEntries,
      outingEntries,
      dashboard,
      loading,
      error,
      refresh,
      createDrink,
      updateDrink,
      deleteDrink,
      createStockEntry,
      createOutingEntry,
      getAnalytics,
    }),
    [
      drinks,
      stockEntries,
      outingEntries,
      dashboard,
      loading,
      error,
      refresh,
      createDrink,
      updateDrink,
      deleteDrink,
      createStockEntry,
      createOutingEntry,
      getAnalytics,
    ],
  );

  return <BarDataContext.Provider value={value}>{children}</BarDataContext.Provider>;
}

export function useBarData() {
  const context = useContext(BarDataContext);
  if (!context) {
    throw new Error("useBarData must be used within BarDataProvider");
  }
  return context;
}
