import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import {
  buildCategoryData,
  buildMonthlyOutingData,
  buildWeeklyOutingData,
  getDrinkStatus,
  type OutingEntry,
  type PriceChangeEntry,
  type PriceChangeSummary,
  type StockEntry,
} from "../lib/analytics";
import { formatNaira } from "../lib/currency";
import { categoryData, mockActivities, mockDrinks, salesChartData, weeklyOutingData, type Drink, type OutingType } from "../data/mockData";

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

async function loadFallbackAnalytics() {
  const fallbackByDrink = mockDrinks.slice(0, 6).map((drink, index) => {
    const quantity = 200 - index * 12;
    const revenue = drink.sellingPrice * quantity;
    const cost = drink.costPrice * quantity;
    const netProfitLoss = revenue - cost;

    return {
      drinkId: drink.id,
      drinkName: drink.name,
      quantity,
      salesQuantity: quantity,
      revenue,
      cost,
      profit: Math.max(netProfitLoss, 0),
      loss: Math.max(-netProfitLoss, 0),
      netProfitLoss,
      outingType: "All" as const,
    };
  });

  const totalRevenue = salesChartData[salesChartData.length - 1]?.revenue ?? 0;
  const totalCost = Number((totalRevenue * 0.72).toFixed(2));
  const netProfitLoss = totalRevenue - totalCost;

  return {
    summary: {
      totalRevenue,
      totalCost,
      profit: Math.max(netProfitLoss, 0),
      loss: Math.max(-netProfitLoss, 0),
      netProfitLoss,
      salesQuantity: 21300,
      bdQuantity: 1560,
      hotelQuantity: 1890,
      totalItems: mockDrinks.length,
      uniqueDrinks: mockDrinks.length,
    },
    byDrink: fallbackByDrink,
    monthlyTrend: salesChartData.map((item) => ({
      month: item.month,
      sales: item.sales,
      bd: 0,
      hotel: 0,
      revenue: item.revenue,
      cost: Number((item.revenue * 0.72).toFixed(2)),
      profit: Number((item.revenue * 0.28).toFixed(2)),
      loss: 0,
      netProfitLoss: Number((item.revenue * 0.28).toFixed(2)),
    })),
    categoryData,
    weeklyOutingData,
    priceChanges: [],
    priceChangeSummary: {
      updates: 0,
      positiveImpact: 0,
      negativeImpact: 0,
      netImpact: 0,
      affectedDrinks: 0,
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
      setStockEntries([]);
      setOutingEntries([]);
      setDashboard({
        stats: {
          totalInventory: mockDrinks.reduce((sum, drink) => sum + drink.quantity, 0),
          totalSalesToday: formatNaira(2847),
          monthlyRevenue: formatNaira(71800),
          lowStockDrinks: mockDrinks.filter((drink) => drink.status === "Low Stock").length,
          hotelRefreshments: 127,
          bdCount: 43,
        },
        recentActivities: mockActivities,
        lowStockDrinks: mockDrinks.filter((drink) => drink.status === "Low Stock"),
        categoryData,
        salesChartData,
        weeklyOutingData,
      });
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
    return (await api.getAnalytics(filters)) as AnalyticsPayload;
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
