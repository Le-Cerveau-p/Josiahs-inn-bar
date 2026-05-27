import { useMemo, useState, type FormEvent } from "react";
import { Plus, Trash2, DollarSign, Coffee, Wine, ShoppingCart, Calendar } from "lucide-react";
import { useBarData } from "../context/BarDataContext";
import { formatNaira } from "../lib/currency";
import { type OutingType } from "../data/mockData";

interface OutingRow {
  id: string;
  drinkId: string;
  drinkName: string;
  quantity: number;
  price: number;
}

export function Outing() {
  const { drinks, outingEntries, createOutingEntry } = useBarData();
  const [outingType, setOutingType] = useState<OutingType>("Sales");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rows, setRows] = useState<OutingRow[]>([{ id: "1", drinkId: "", drinkName: "", quantity: 0, price: 0 }]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addRow = () => {
    setRows((current) => [...current, { id: Date.now().toString(), drinkId: "", drinkName: "", quantity: 0, price: 0 }]);
  };

  const removeRow = (id: string) => {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  };

  const updateRow = (id: string, field: keyof OutingRow, value: string | number) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id === id) {
          if (field === "drinkId") {
            const drink = drinks.find((item) => item.id === value);
            return {
              ...row,
              drinkId: value as string,
              drinkName: drink?.name || "",
              price: drink?.sellingPrice || drink?.unitPrice || 0,
            };
          }
          return { ...row, [field]: value };
        }
        return row;
      }),
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedNotes = notes.trim();

    if (outingType === "B&D" && !normalizedNotes) {
      setMessage("Notes are required for Damaged and Broken entries.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await createOutingEntry({
        date,
        type: outingType,
        notes: normalizedNotes,
        items: rows.map((row) => ({
          drinkId: row.drinkId,
          quantity: row.quantity,
        })),
      });
      setRows([{ id: Date.now().toString(), drinkId: "", drinkName: "", quantity: 0, price: 0 }]);
      setNotes("");
      setMessage("Outing entry saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save outing entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = rows.reduce((acc, row) => acc + row.quantity * row.price, 0);

  const recentOutings = useMemo(
    () =>
      outingEntries
        .flatMap((entry) =>
          entry.items.map((item) => ({
            id: `${entry.id}:${item.id}`,
            date: entry.date,
            type: entry.type,
            drinkName: item.drinkName,
            quantity: item.quantity,
            total: formatNaira(item.quantity * item.unitPrice),
          })),
        )
        .slice(0, 6),
    [outingEntries],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-bold text-white">Outing Management</h2>
        <p className="text-gray-400">Record drinks leaving inventory</p>
      </div>

      <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
        <label className="mb-3 block text-sm font-medium text-gray-300">Select Outing Type</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setOutingType("Sales")}
            className={`rounded-xl border-2 p-6 transition-all duration-200 ${
              outingType === "Sales"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
            }`}
          >
            <ShoppingCart className={`mx-auto mb-3 h-8 w-8 ${outingType === "Sales" ? "text-green-400" : "text-gray-400"}`} />
            <div className={`text-lg font-bold ${outingType === "Sales" ? "text-green-400" : "text-white"}`}>Sales</div>
            <div className="mt-1 text-sm text-gray-400">Regular customer sales</div>
          </button>

          <button
            type="button"
            onClick={() => setOutingType("B&D")}
            className={`rounded-xl border-2 p-6 transition-all duration-200 ${
              outingType === "B&D"
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
            }`}
          >
            <Wine className={`mx-auto mb-3 h-8 w-8 ${outingType === "B&D" ? "text-purple-400" : "text-gray-400"}`} />
            <div className={`text-lg font-bold ${outingType === "B&D" ? "text-purple-400" : "text-white"}`}>B&D</div>
            <div className="mt-1 text-sm text-gray-400">Damaged and broken items</div>
          </button>

          <button
            type="button"
            onClick={() => setOutingType("Hotel Refreshment")}
            className={`rounded-xl border-2 p-6 transition-all duration-200 ${
              outingType === "Hotel Refreshment"
                ? "border-orange-500 bg-orange-500/10"
                : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
            }`}
          >
            <Coffee
              className={`mx-auto mb-3 h-8 w-8 ${outingType === "Hotel Refreshment" ? "text-orange-400" : "text-gray-400"}`}
            />
            <div className={`text-lg font-bold ${outingType === "Hotel Refreshment" ? "text-orange-400" : "text-white"}`}>
              Hotel Refreshment
            </div>
            <div className="mt-1 text-sm text-gray-400">Complimentary drinks</div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                <Calendar className="mr-2 inline h-4 w-4" />
                Outing Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Select Drinks</label>
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Drink
                </button>
              </div>

              <div className="space-y-3">
                {rows.map((row, index) => {
                  const drink = drinks.find((item) => item.id === row.drinkId);
                  const hasInsufficientStock = Boolean(drink) && row.quantity > drink.quantity;

                  return (
                    <div
                      key={row.id}
                      className={`space-y-3 rounded-xl border p-4 ${
                        hasInsufficientStock ? "border-red-500/50 bg-red-500/10" : "border-gray-700 bg-gray-800/30"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Drink #{index + 1}</span>
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

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="md:col-span-2">
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
                                {drink.name} - Stock: {drink.quantity} - {formatNaira(drink.sellingPrice)}
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
                      </div>

                      {hasInsufficientStock && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-2">
                          <p className="text-xs text-red-400">Insufficient stock! Available: {drink?.quantity}</p>
                        </div>
                      )}

                      {row.drinkId && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Selling Price: {formatNaira(row.price)}</span>
                          <span className="font-bold text-green-400">Total: {formatNaira(row.quantity * row.price)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Extra Notes {outingType === "B&D" ? "(Required for B&D)" : "(Optional)"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                rows={3}
                placeholder={outingType === "B&D" ? "Explain the damaged or broken items..." : "Add any additional notes..."}
                required={outingType === "B&D"}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Recording..." : `Record ${outingType}`}
            </button>
            {message && <p className="text-sm text-gray-300">{message}</p>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <DollarSign className="h-5 w-5 text-green-400" />
              Transaction Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Type</span>
                <span className="text-sm font-medium text-white">{outingType}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Items</span>
                <span className="text-xl font-bold text-green-400">{rows.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">Total Quantity</span>
                <span className="text-xl font-bold text-green-400">{rows.reduce((acc, row) => acc + row.quantity, 0)}</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">Subtotal</span>
                  <span className="text-2xl font-bold text-green-400">{formatNaira(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-bold text-white">Inventory Impact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Selected drinks will be deducted from inventory.</p>
              <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3">
                <p className="text-xs text-orange-400">Ensure sufficient stock before recording transaction.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-bold text-white">Recent Outing Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Drink</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOutings.length > 0 ? (
                recentOutings.map((outing) => (
                  <tr key={outing.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-gray-300">{outing.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          outing.type === "Sales"
                            ? "bg-green-500/20 text-green-400"
                            : outing.type === "B&D"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {outing.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{outing.drinkName}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{outing.quantity}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-400">{outing.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-400" colSpan={5}>
                    No outing entries yet.
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
