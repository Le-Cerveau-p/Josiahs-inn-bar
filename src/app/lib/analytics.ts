import type { Drink, DrinkCategory, OutingType } from "../data/mockData";

export type StockEntry = {
  id: string;
  date: string;
  notes?: string;
  items: Array<{
    id: string;
    drinkId: string;
    drinkName: string;
    quantity: number;
    supplier: string;
    notes?: string;
    unitPrice: number;
  }>;
};

export type OutingEntry = {
  id: string;
  date: string;
  type: OutingType;
  notes?: string;
  items: Array<{
    id: string;
    drinkId: string;
    drinkName: string;
    quantity: number;
    unitPrice: number;
  }>;
};

export function getDrinkStatus(quantity: number): Drink["status"] {
  if (quantity <= 0) {
    return "Out of Stock";
  }
  if (quantity <= 15) {
    return "Low Stock";
  }
  return "In Stock";
}

export function isWithinRange(date: string, from?: string, to?: string) {
  const current = date.slice(0, 10);
  if (from && current < from) return false;
  if (to && current > to) return false;
  return true;
}

export function formatMonthKey(date: string) {
  return date.slice(0, 7);
}

export function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
  return label.replace(",", "");
}

export function buildCategoryData(drinks: Drink[]) {
  const totals = new Map<DrinkCategory, number>();
  drinks.forEach((drink) => {
    totals.set(drink.category, (totals.get(drink.category) ?? 0) + drink.quantity);
  });
  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}

export function buildWeeklyOutingData(entries: OutingEntry[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const base = days.map((day) => ({ day, sales: 0, bd: 0, hotel: 0 }));

  entries.forEach((entry) => {
    const dayIndex = new Date(`${entry.date.slice(0, 10)}T12:00:00Z`).getUTCDay();
    const bucket = base[dayIndex];
    const totalQuantity = entry.items.reduce((sum, item) => sum + item.quantity, 0);

    if (entry.type === "Sales") {
      bucket.sales += totalQuantity;
    } else if (entry.type === "B&D") {
      bucket.bd += totalQuantity;
    } else {
      bucket.hotel += totalQuantity;
    }
  });

  return base;
}

export function buildMonthlyOutingData(entries: OutingEntry[]) {
  const buckets = new Map<string, { month: string; sales: number; bd: number; hotel: number; revenue: number }>();

  entries.forEach((entry) => {
    const key = formatMonthKey(entry.date);
    const current = buckets.get(key) ?? {
      month: formatMonthLabel(key),
      sales: 0,
      bd: 0,
      hotel: 0,
      revenue: 0,
    };

    const quantity = entry.items.reduce((sum, item) => sum + item.quantity, 0);
    const revenue = entry.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    if (entry.type === "Sales") {
      current.sales += quantity;
      current.revenue += revenue;
    } else if (entry.type === "B&D") {
      current.bd += quantity;
    } else {
      current.hotel += quantity;
    }

    buckets.set(key, current);
  });

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
}
