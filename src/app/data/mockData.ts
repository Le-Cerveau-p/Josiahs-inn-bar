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
