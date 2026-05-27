import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Download, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useBarData } from "../context/BarDataContext";
import { formatNaira } from "../lib/currency";
import { type DrinkCategory } from "../data/mockData";

const categories: (DrinkCategory | "All")[] = ["All", "Beer", "Wine", "Spirits", "Cocktails", "Soft Drinks", "Other"];

export function Inventory() {
  const { drinks } = useBarData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDrinks = useMemo(() => {
    return drinks.filter((drink) => {
      const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || drink.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [drinks, searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredDrinks.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrinks = filteredDrinks.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const shownStart = filteredDrinks.length === 0 ? 0 : startIndex + 1;
  const shownEnd = Math.min(startIndex + itemsPerPage, filteredDrinks.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-white">Inventory Management</h2>
          <p className="text-gray-400">Track and manage all drink inventory</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500"
        >
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drinks..."
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-3 pl-11 pr-4 text-white placeholder-gray-500 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DrinkCategory | "All")}
              className="cursor-pointer appearance-none rounded-xl border border-gray-700 bg-gray-800/50 py-3 pl-11 pr-8 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-900/80 backdrop-blur-sm">
              <tr className="border-b border-gray-800">
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Drink Name</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Quantity</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Cost Price</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Selling Price</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Profit / Unit</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Last Updated</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDrinks.length > 0 ? (
                paginatedDrinks.map((drink) => (
                  <tr key={drink.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20">
                          <span className="text-lg">{drink.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-white">{drink.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-gray-800/50 px-3 py-1 text-sm text-gray-300">{drink.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            drink.status === "In Stock" ? "bg-green-500" : drink.status === "Low Stock" ? "bg-orange-500" : "bg-red-500"
                          }`}
                        />
                        <span className="font-medium text-white">{drink.quantity}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-white">{formatNaira(drink.costPrice)}</td>
                    <td className="px-4 py-4 font-medium text-white">{formatNaira(drink.sellingPrice)}</td>
                    <td className={`px-4 py-4 font-medium ${drink.sellingPrice - drink.costPrice >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatNaira(drink.sellingPrice - drink.costPrice)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">{drink.lastUpdated}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          drink.status === "In Stock"
                            ? "bg-green-500/20 text-green-400"
                            : drink.status === "Low Stock"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {drink.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button type="button" className="rounded-lg p-2 text-blue-400 transition-colors hover:bg-blue-500/10">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded-lg p-2 text-green-400 transition-colors hover:bg-green-500/10">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-400" colSpan={9}>
                    No drinks match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-6">
          <div className="text-sm text-gray-400">
            Showing {shownStart} to {shownEnd} of {filteredDrinks.length} drinks
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-4 py-2 font-medium transition-all ${
                  currentPage === page
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
