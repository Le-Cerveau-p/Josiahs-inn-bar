import { useMemo, useState, type FormEvent } from "react";
import { Plus, Trash2, Calendar, Package } from "lucide-react";
import { useBarData } from "../context/BarDataContext";

interface StockRow {
  id: string;
  drinkId: string;
  quantity: number;
  supplier: string;
  notes: string;
}

export function Stocking() {
  const { drinks, stockEntries, createStockEntry } = useBarData();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entryNotes, setEntryNotes] = useState("");
  const [rows, setRows] = useState<StockRow[]>([{ id: "1", drinkId: "", quantity: 0, supplier: "", notes: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addRow = () => {
    setRows((current) => [...current, { id: Date.now().toString(), drinkId: "", quantity: 0, supplier: "", notes: "" }]);
  };

  const removeRow = (id: string) => {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  };

  const updateRow = (id: string, field: keyof StockRow, value: string | number) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await createStockEntry({
        date,
        notes: entryNotes,
        items: rows.map((row) => ({
          drinkId: row.drinkId,
          quantity: row.quantity,
          supplier: row.supplier,
          notes: row.notes,
        })),
      });

      setRows([{ id: Date.now().toString(), drinkId: "", quantity: 0, supplier: "", notes: "" }]);
      setEntryNotes("");
      setMessage("Stock entry saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save stock entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalItems = rows.reduce((acc, row) => acc + (row.quantity || 0), 0);

  const recentStockings = useMemo(
    () =>
      stockEntries
        .flatMap((entry) =>
          entry.items.map((item) => ({
            id: `${entry.id}:${item.id}`,
            date: entry.date,
            drinkName: item.drinkName,
            quantity: item.quantity,
            supplier: item.supplier,
          })),
        )
        .slice(0, 6),
    [stockEntries],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-bold text-white">Stock Entry</h2>
        <p className="text-gray-400">Add new stock to your inventory</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                <Calendar className="mr-2 inline h-4 w-4" />
                Stocking Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Entry Notes</label>
              <textarea
                value={entryNotes}
                onChange={(e) => setEntryNotes(e.target.value)}
                className="min-h-20 w-full resize-none rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                rows={3}
                placeholder="Optional note for this stocking entry"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Stock Items</label>
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </button>
              </div>

              <div className="space-y-3">
                {rows.map((row, index) => (
                  <div key={row.id} className="space-y-3 rounded-xl border border-gray-700 bg-gray-800/30 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">Item #{index + 1}</span>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-400">Drink</label>
                        <select
                          value={row.drinkId}
                          onChange={(e) => updateRow(row.id, "drinkId", e.target.value)}
                          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                          required
                        >
                          <option value="">Select drink...</option>
                          {drinks.map((drink) => (
                            <option key={drink.id} value={drink.id}>
                              {drink.name} - {drink.category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-400">Quantity</label>
                        <input
                          type="number"
                          value={row.quantity || ""}
                          onChange={(e) => updateRow(row.id, "quantity", parseInt(e.target.value, 10) || 0)}
                          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                          placeholder="0"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-400">Supplier</label>
                        <input
                          type="text"
                          value={row.supplier}
                          onChange={(e) => updateRow(row.id, "supplier", e.target.value)}
                          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                          placeholder="Supplier name"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-400">Notes (Optional)</label>
                        <input
                          type="text"
                          value={row.notes}
                          onChange={(e) => updateRow(row.id, "notes", e.target.value)}
                          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                          placeholder="Additional notes"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Submit Stock Entry"}
            </button>
            {message && <p className="text-sm text-gray-300">{message}</p>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-bold text-white">Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Date</span>
                <span className="text-sm font-medium text-white">{date}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Total Items</span>
                <span className="text-xl font-bold text-green-400">{rows.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Total Quantity</span>
                <span className="text-xl font-bold text-green-400">{totalItems}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Package className="h-5 w-5 text-green-400" />
              Inventory Update Preview
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Adding stock will update your inventory levels in real time.</p>
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3">
                <p className="text-green-400">All selected drinks will have their quantities increased.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-bold text-white">Recent Stocking History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Drink Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {recentStockings.length > 0 ? (
                recentStockings.map((stock) => (
                  <tr key={stock.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-gray-300">{stock.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{stock.drinkName}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-400">+{stock.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{stock.supplier}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-400" colSpan={4}>
                    No stock entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
