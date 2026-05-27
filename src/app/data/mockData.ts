export type DrinkCategory = 'Beer' | 'Wine' | 'Spirits' | 'Cocktails' | 'Soft Drinks' | 'Other';
export type OutingType = 'Sales' | 'B&D' | 'Hotel Refreshment';
export type ActivityType = 'Stocking' | 'Sales' | 'B&D' | 'Hotel Refreshment';

export interface Drink {
  id: string;
  name: string;
  category: DrinkCategory;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  sellingPrice: number;
  image?: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Activity {
  id: string;
  date: string;
  type: ActivityType;
  drinkName: string;
  quantity: number;
  user: string;
  status: 'Completed' | 'Pending';
}

export interface StockingEntry {
  id: string;
  date: string;
  drinkName: string;
  quantity: number;
  supplier: string;
  notes?: string;
}

export interface OutingEntry {
  id: string;
  date: string;
  type: OutingType;
  drinkName: string;
  quantity: number;
  price?: number;
  notes?: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DemoStockEntry {
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
    costPrice: number;
  }>;
}

export interface DemoOutingEntry {
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
    costPrice: number;
  }>;
}

export interface DemoPriceChange {
  id: string;
  drinkId: string;
  drinkName: string;
  changeSummary: string;
  changedAt: string;
  oldCostPrice: number;
  newCostPrice: number;
  oldSellingPrice: number;
  newSellingPrice: number;
  quantityOnHand: number;
  unitMarginBefore: number;
  unitMarginAfter: number;
  marginDelta: number;
  inventoryImpact: number;
}

export const mockDrinks: Drink[] = [
  { id: '1', name: 'Heineken', category: 'Beer', quantity: 145, costPrice: 4.1, sellingPrice: 5.99, unitPrice: 5.99, lastUpdated: '2026-05-15', status: 'In Stock' },
  { id: '2', name: 'Corona Extra', category: 'Beer', quantity: 89, costPrice: 4.45, sellingPrice: 6.49, unitPrice: 6.49, lastUpdated: '2026-05-16', status: 'In Stock' },
  { id: '3', name: 'Budweiser', category: 'Beer', quantity: 12, costPrice: 3.4, sellingPrice: 4.99, unitPrice: 4.99, lastUpdated: '2026-05-14', status: 'Low Stock' },
  { id: '4', name: 'Chardonnay', category: 'Wine', quantity: 34, costPrice: 11.8, sellingPrice: 15.99, unitPrice: 15.99, lastUpdated: '2026-05-17', status: 'In Stock' },
  { id: '5', name: 'Cabernet Sauvignon', category: 'Wine', quantity: 8, costPrice: 13.2, sellingPrice: 18.99, unitPrice: 18.99, lastUpdated: '2026-05-13', status: 'Low Stock' },
  { id: '6', name: 'Merlot', category: 'Wine', quantity: 42, costPrice: 11.7, sellingPrice: 16.49, unitPrice: 16.49, lastUpdated: '2026-05-16', status: 'In Stock' },
  { id: '7', name: 'Jack Daniels', category: 'Spirits', quantity: 56, costPrice: 22.8, sellingPrice: 28.99, unitPrice: 28.99, lastUpdated: '2026-05-17', status: 'In Stock' },
  { id: '8', name: 'Johnnie Walker', category: 'Spirits', quantity: 23, costPrice: 26.5, sellingPrice: 32.99, unitPrice: 32.99, lastUpdated: '2026-05-15', status: 'In Stock' },
  { id: '9', name: 'Grey Goose Vodka', category: 'Spirits', quantity: 18, costPrice: 31.5, sellingPrice: 39.99, unitPrice: 39.99, lastUpdated: '2026-05-16', status: 'In Stock' },
  { id: '10', name: 'Bacardi Rum', category: 'Spirits', quantity: 5, costPrice: 19.2, sellingPrice: 24.99, unitPrice: 24.99, lastUpdated: '2026-05-12', status: 'Low Stock' },
  { id: '11', name: 'Mojito', category: 'Cocktails', quantity: 67, costPrice: 8.25, sellingPrice: 12.99, unitPrice: 12.99, lastUpdated: '2026-05-17', status: 'In Stock' },
  { id: '12', name: 'Margarita', category: 'Cocktails', quantity: 54, costPrice: 7.9, sellingPrice: 11.99, unitPrice: 11.99, lastUpdated: '2026-05-17', status: 'In Stock' },
  { id: '13', name: 'Martini', category: 'Cocktails', quantity: 31, costPrice: 9.15, sellingPrice: 13.99, unitPrice: 13.99, lastUpdated: '2026-05-16', status: 'In Stock' },
  { id: '14', name: 'Coca-Cola', category: 'Soft Drinks', quantity: 198, costPrice: 1.55, sellingPrice: 2.49, unitPrice: 2.49, lastUpdated: '2026-05-17', status: 'In Stock' },
  { id: '15', name: 'Sprite', category: 'Soft Drinks', quantity: 156, costPrice: 1.55, sellingPrice: 2.49, unitPrice: 2.49, lastUpdated: '2026-05-17', status: 'In Stock' },
  { id: '16', name: 'Orange Juice', category: 'Soft Drinks', quantity: 87, costPrice: 2.6, sellingPrice: 3.99, unitPrice: 3.99, lastUpdated: '2026-05-16', status: 'In Stock' },
];

export const mockActivities: Activity[] = [
  { id: '1', date: '2026-05-17 14:32', type: 'Sales', drinkName: 'Heineken', quantity: 24, user: 'John Doe', status: 'Completed' },
  { id: '2', date: '2026-05-17 13:15', type: 'Stocking', drinkName: 'Corona Extra', quantity: 50, user: 'Sarah Smith', status: 'Completed' },
  { id: '3', date: '2026-05-17 11:45', type: 'Hotel Refreshment', drinkName: 'Orange Juice', quantity: 12, user: 'Mike Johnson', status: 'Completed' },
  { id: '4', date: '2026-05-17 10:20', type: 'B&D', drinkName: 'Jack Daniels', quantity: 3, user: 'Emily Davis', status: 'Completed' },
  { id: '5', date: '2026-05-16 16:50', type: 'Sales', drinkName: 'Mojito', quantity: 18, user: 'John Doe', status: 'Completed' },
  { id: '6', date: '2026-05-16 15:30', type: 'Stocking', drinkName: 'Grey Goose Vodka', quantity: 12, user: 'Sarah Smith', status: 'Completed' },
  { id: '7', date: '2026-05-16 14:10', type: 'Sales', drinkName: 'Chardonnay', quantity: 8, user: 'Mike Johnson', status: 'Completed' },
];

export const salesChartData = [
  { month: 'Jan', sales: 12400, revenue: 45600 },
  { month: 'Feb', sales: 15200, revenue: 52300 },
  { month: 'Mar', sales: 18900, revenue: 61200 },
  { month: 'Apr', sales: 16700, revenue: 58400 },
  { month: 'May', sales: 21300, revenue: 71800 },
];

export const categoryData = [
  { name: 'Beer', value: 340 },
  { name: 'Wine', value: 180 },
  { name: 'Spirits', value: 240 },
  { name: 'Cocktails', value: 290 },
  { name: 'Soft Drinks', value: 450 },
];

export const weeklyOutingData = [
  { day: 'Mon', sales: 145, bd: 12, hotel: 28 },
  { day: 'Tue', sales: 167, bd: 8, hotel: 32 },
  { day: 'Wed', sales: 189, bd: 15, hotel: 24 },
  { day: 'Thu', sales: 203, bd: 10, hotel: 36 },
  { day: 'Fri', sales: 234, bd: 18, hotel: 29 },
  { day: 'Sat', sales: 289, bd: 22, hotel: 41 },
  { day: 'Sun', sales: 198, bd: 14, hotel: 35 },
];

export const mockUsers: DemoUser[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@josiahinnbar.com",
    role: "admin",
    active: true,
    createdAt: "2026-05-01T09:00:00.000Z",
    updatedAt: "2026-05-22T10:15:00.000Z",
  },
  {
    id: "u2",
    name: "Floor Supervisor",
    email: "supervisor@josiahinnbar.com",
    role: "user",
    active: true,
    createdAt: "2026-05-03T09:20:00.000Z",
    updatedAt: "2026-05-20T08:35:00.000Z",
  },
  {
    id: "u3",
    name: "Inventory Clerk",
    email: "inventory@josiahinnbar.com",
    role: "user",
    active: true,
    createdAt: "2026-05-04T09:45:00.000Z",
    updatedAt: "2026-05-21T12:10:00.000Z",
  },
  {
    id: "u4",
    name: "Night Manager",
    email: "night.manager@josiahinnbar.com",
    role: "admin",
    active: false,
    createdAt: "2026-04-28T11:00:00.000Z",
    updatedAt: "2026-05-18T17:40:00.000Z",
  },
];

export const mockStockEntries: DemoStockEntry[] = [
  {
    id: "st-1",
    date: "2026-05-14",
    notes: "Weekly replenishment for fast-moving beer lines",
    items: [
      {
        id: "st-1a",
        drinkId: "2",
        drinkName: "Corona Extra",
        quantity: 50,
        supplier: "ABC Beverages",
        notes: "Delivery 44",
        unitPrice: 6.49,
        costPrice: 4.45,
      },
      {
        id: "st-1b",
        drinkId: "1",
        drinkName: "Heineken",
        quantity: 36,
        supplier: "ABC Beverages",
        notes: "Chilled crate",
        unitPrice: 5.99,
        costPrice: 4.1,
      },
    ],
  },
  {
    id: "st-2",
    date: "2026-05-16",
    notes: "Wine replenishment before the weekend",
    items: [
      {
        id: "st-2a",
        drinkId: "4",
        drinkName: "Chardonnay",
        quantity: 24,
        supplier: "Wine Distributors Ltd",
        notes: "",
        unitPrice: 15.99,
        costPrice: 11.8,
      },
      {
        id: "st-2b",
        drinkId: "6",
        drinkName: "Merlot",
        quantity: 18,
        supplier: "Wine Distributors Ltd",
        notes: "Promotional batch",
        unitPrice: 16.49,
        costPrice: 11.7,
      },
    ],
  },
  {
    id: "st-3",
    date: "2026-05-18",
    notes: "Soft drinks and mixers top-up",
    items: [
      {
        id: "st-3a",
        drinkId: "14",
        drinkName: "Coca-Cola",
        quantity: 72,
        supplier: "Bottlers Plus",
        notes: "",
        unitPrice: 2.49,
        costPrice: 1.55,
      },
      {
        id: "st-3b",
        drinkId: "15",
        drinkName: "Sprite",
        quantity: 60,
        supplier: "Bottlers Plus",
        notes: "",
        unitPrice: 2.49,
        costPrice: 1.55,
      },
      {
        id: "st-3c",
        drinkId: "16",
        drinkName: "Orange Juice",
        quantity: 30,
        supplier: "Fresh Press Suppliers",
        notes: "Brunch stock",
        unitPrice: 3.99,
        costPrice: 2.6,
      },
    ],
  },
];

export const mockOutingEntries: DemoOutingEntry[] = [
  {
    id: "out-1",
    date: "2026-05-16",
    type: "Sales",
    notes: "Friday evening service",
    items: [
      {
        id: "out-1a",
        drinkId: "1",
        drinkName: "Heineken",
        quantity: 24,
        unitPrice: 5.99,
        costPrice: 4.1,
      },
      {
        id: "out-1b",
        drinkId: "11",
        drinkName: "Mojito",
        quantity: 18,
        unitPrice: 12.99,
        costPrice: 8.25,
      },
    ],
  },
  {
    id: "out-2",
    date: "2026-05-17",
    type: "Hotel Refreshment",
    notes: "Complimentary drinks for guests",
    items: [
      {
        id: "out-2a",
        drinkId: "16",
        drinkName: "Orange Juice",
        quantity: 12,
        unitPrice: 3.99,
        costPrice: 2.6,
      },
    ],
  },
  {
    id: "out-3",
    date: "2026-05-18",
    type: "B&D",
    notes: "Broken bottle write-off",
    items: [
      {
        id: "out-3a",
        drinkId: "7",
        drinkName: "Jack Daniels",
        quantity: 3,
        unitPrice: 28.99,
        costPrice: 22.8,
      },
    ],
  },
  {
    id: "out-4",
    date: "2026-05-20",
    type: "Sales",
    notes: "Midweek sales register close",
    items: [
      {
        id: "out-4a",
        drinkId: "4",
        drinkName: "Chardonnay",
        quantity: 8,
        unitPrice: 15.99,
        costPrice: 11.8,
      },
      {
        id: "out-4b",
        drinkId: "14",
        drinkName: "Coca-Cola",
        quantity: 28,
        unitPrice: 2.49,
        costPrice: 1.55,
      },
    ],
  },
  {
    id: "out-5",
    date: "2026-05-22",
    type: "Sales",
    notes: "Friday bar rush",
    items: [
      {
        id: "out-5a",
        drinkId: "2",
        drinkName: "Corona Extra",
        quantity: 16,
        unitPrice: 6.49,
        costPrice: 4.45,
      },
      {
        id: "out-5b",
        drinkId: "12",
        drinkName: "Margarita",
        quantity: 14,
        unitPrice: 11.99,
        costPrice: 7.9,
      },
    ],
  },
  {
    id: "out-6",
    date: "2026-05-24",
    type: "Hotel Refreshment",
    notes: "Sunday brunch service",
    items: [
      {
        id: "out-6a",
        drinkId: "15",
        drinkName: "Sprite",
        quantity: 20,
        unitPrice: 2.49,
        costPrice: 1.55,
      },
    ],
  },
];

export const mockPriceChanges: DemoPriceChange[] = [
  {
    id: "pc-1",
    drinkId: "1",
    drinkName: "Heineken",
    changeSummary: "Cost and selling price adjusted after supplier increase",
    changedAt: "2026-05-15T08:30:00.000Z",
    oldCostPrice: 4.1,
    newCostPrice: 4.35,
    oldSellingPrice: 5.99,
    newSellingPrice: 6.29,
    quantityOnHand: 145,
    unitMarginBefore: 1.89,
    unitMarginAfter: 1.94,
    marginDelta: 0.05,
    inventoryImpact: 7.25,
  },
  {
    id: "pc-2",
    drinkId: "4",
    drinkName: "Chardonnay",
    changeSummary: "Selling price rounded up for weekend service",
    changedAt: "2026-05-18T11:00:00.000Z",
    oldCostPrice: 11.8,
    newCostPrice: 11.8,
    oldSellingPrice: 15.99,
    newSellingPrice: 16.49,
    quantityOnHand: 34,
    unitMarginBefore: 4.19,
    unitMarginAfter: 4.69,
    marginDelta: 0.5,
    inventoryImpact: 17,
  },
  {
    id: "pc-3",
    drinkId: "7",
    drinkName: "Jack Daniels",
    changeSummary: "Supplier discount applied to spirits line",
    changedAt: "2026-05-21T09:10:00.000Z",
    oldCostPrice: 22.8,
    newCostPrice: 22.1,
    oldSellingPrice: 28.99,
    newSellingPrice: 28.99,
    quantityOnHand: 56,
    unitMarginBefore: 6.19,
    unitMarginAfter: 6.89,
    marginDelta: 0.7,
    inventoryImpact: 39.2,
  },
  {
    id: "pc-4",
    drinkId: "14",
    drinkName: "Coca-Cola",
    changeSummary: "Bulk pricing updated for soft drinks",
    changedAt: "2026-05-23T14:45:00.000Z",
    oldCostPrice: 1.55,
    newCostPrice: 1.48,
    oldSellingPrice: 2.49,
    newSellingPrice: 2.49,
    quantityOnHand: 198,
    unitMarginBefore: 0.94,
    unitMarginAfter: 1.01,
    marginDelta: 0.07,
    inventoryImpact: 13.86,
  },
];
