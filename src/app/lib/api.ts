export type ApiError = Error & { status?: number };

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message || response.statusText) as ApiError;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  getDrinks: () => request("/api/drinks"),
  createDrink: (body: unknown) => request("/api/drinks", { method: "POST", body: JSON.stringify(body) }),
  updateDrink: (id: string, body: unknown) =>
    request(`/api/drinks/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteDrink: (id: string) => request(`/api/drinks/${id}`, { method: "DELETE" }),
  getStockEntries: () => request("/api/stocking-entries"),
  createStockEntry: (body: unknown) =>
    request("/api/stocking-entries", { method: "POST", body: JSON.stringify(body) }),
  getOutingEntries: () => request("/api/outing-entries"),
  createOutingEntry: (body: unknown) =>
    request("/api/outing-entries", { method: "POST", body: JSON.stringify(body) }),
  getDashboard: () => request("/api/dashboard"),
  getAnalytics: (query: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request(`/api/analytics${suffix}`);
  },
};
