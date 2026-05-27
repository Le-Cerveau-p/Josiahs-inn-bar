import { useMemo, useState, type FormEvent } from "react";
import { Plus, Edit, Trash2, Upload, X, Check } from "lucide-react";
import { useBarData } from "../context/BarDataContext";
import { formatNaira } from "../lib/currency";
import { type DrinkCategory } from "../data/mockData";

export function DrinkManagement() {
  const { drinks, createDrink, updateDrink, deleteDrink } = useBarData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Beer" as DrinkCategory,
    costPrice: "",
    sellingPrice: "",
    quantity: "",
  });

  const editingDrink = useMemo(() => drinks.find((drink) => drink.id === editingId) ?? null, [drinks, editingId]);
  const unitProfit = Number(formData.sellingPrice || 0) - Number(formData.costPrice || 0);
  const margin = Number(formData.sellingPrice || 0) > 0 ? (unitProfit / Number(formData.sellingPrice || 0)) * 100 : 0;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "Beer",
      costPrice: "",
      sellingPrice: "",
      quantity: "",
    });
    setShowAddModal(true);
  };

  const openEditModal = (id: string) => {
    const drink = drinks.find((item) => item.id === id);
    if (!drink) return;

    setEditingId(id);
    setFormData({
      name: drink.name,
      category: drink.category,
      costPrice: String(drink.costPrice),
      sellingPrice: String(drink.sellingPrice),
      quantity: String(drink.quantity),
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        unitPrice: Number(formData.sellingPrice),
        quantity: Number(formData.quantity) || 0,
        active: true,
      };

      if (editingDrink) {
        await updateDrink(editingDrink.id, payload);
      } else {
        await createDrink(payload);
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-white">Drink Management</h2>
          <p className="text-gray-400">Manage your drink catalog and pricing</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500"
        >
          <Plus className="h-4 w-4" />
          Add New Drink
        </button>
      </div>

      <div className="rounded-2xl border border-green-900/20 bg-gray-900/50 p-6 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-900/80 backdrop-blur-sm">
              <tr className="border-b border-gray-800">
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Drink Name</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Cost Price</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Selling Price</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Profit / Unit</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Current Quantity</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drinks.map((drink) => {
                const profitPerUnit = drink.sellingPrice - drink.costPrice;

                return (
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
                      <span className="font-medium text-white">{formatNaira(drink.costPrice)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-white">{formatNaira(drink.sellingPrice)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-medium ${profitPerUnit >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {formatNaira(profitPerUnit)}
                      </span>
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
                        <button
                          type="button"
                          onClick={() => openEditModal(drink.id)}
                          className="rounded-lg p-2 text-green-400 transition-colors hover:bg-green-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Delete ${drink.name}?`)) {
                              await deleteDrink(drink.id);
                            }
                          }}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-green-900/20 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">{editingDrink ? "Edit Drink" : "Add New Drink"}</h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-300">Drink Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Enter drink name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as DrinkCategory })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    required
                  >
                    <option value="Beer">Beer</option>
                    <option value="Wine">Wine</option>
                    <option value="Spirits">Spirits</option>
                    <option value="Cocktails">Cocktails</option>
                    <option value="Soft Drinks">Soft Drinks</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Cost Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Selling Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white transition-all placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Unit Profit</div>
                        <div className={`text-lg font-bold ${unitProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {formatNaira(unitProfit)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Margin</div>
                        <div className="text-lg font-bold text-white">{margin.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-300">Drink Image (Optional)</label>
                  <div className="flex w-full items-center justify-center">
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30 transition-colors hover:bg-gray-800/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-medium text-white transition-all duration-200 hover:from-green-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Saving..." : editingDrink ? "Save Changes" : "Add Drink"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-gray-700 bg-gray-800/50 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
