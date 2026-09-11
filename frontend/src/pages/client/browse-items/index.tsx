import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Search, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  formatDate,
  getApiError,
  getCategories,
  getItems,
  type Category,
  type Item,
} from "@/lib/client";
import ClientPage, {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from "@/pages/client/ClientPage";

export default function BrowseItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimReason, setClaimReason] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError) =>
        setError(getApiError(requestError, "Unable to load categories.")),
      );
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      getItems(filters)
        .then(setItems)
        .catch((requestError) =>
          setError(getApiError(requestError, "Unable to load browse items.")),
        )
        .finally(() => setLoading(false));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [filters]);

  const submitClaim = async (item: Item) => {
    if (!claimReason.trim()) {
      toast.error("Please explain why this item belongs to you.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("claim_reason", claimReason.trim());
      if (proof) formData.append("proof", proof);

      await api.post(`/found-items/${item.id}/claims`, formData);
      setClaimingId(null);
      setClaimReason("");
      setProof(null);
      toast.success("Claim submitted for review.");
    } catch (requestError) {
      const message = getApiError(requestError, "Unable to submit your claim.");
      toast.error(message);
      setError(message);
    }
  };

  return (
    <ClientPage
      title="Browse items"
      description="Search reported items and submit a claim when you recognize one."
    >
      <div className="mb-5 flex flex-wrap gap-3 rounded-xl border border-[#E2DDD0] bg-white p-4">
        <div className="flex min-w-60 flex-1 items-center gap-2 rounded-lg border border-[#E2DDD0] px-3 py-2">
          <Search size={16} className="text-[#83796A]" />
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters({ ...filters, search: event.target.value })
            }
            placeholder="Search title or description"
            className="w-full text-sm outline-none"
          />
        </div>
        <select
          value={filters.category}
          onChange={(event) =>
            setFilters({ ...filters, category: event.target.value })
          }
          className="rounded-lg border border-[#E2DDD0] bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : items.length === 0 ? (
        <EmptyState message="No items match your search." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="rounded-xl border border-[#E2DDD0] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#1B2430]">{item.title}</h3>
                  <p className="mt-1 text-xs text-[#83796A]">
                    {item.category?.name ?? "Uncategorized"} · {item.type}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-4 text-sm text-[#5F5A50]">{item.description}</p>
              <div className="mt-4 space-y-2 text-xs text-[#83796A]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {item.location}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  {formatDate(item.date)}
                </div>
              </div>
              {item.type === "found" && (
                <>
                  {claimingId === item.id ? (
                    <div className="mt-4">
                      <textarea
                        value={claimReason}
                        onChange={(event) => setClaimReason(event.target.value)}
                        rows={3}
                        placeholder="Explain why this item belongs to you"
                        className="w-full rounded-lg border border-[#E2DDD0] p-2.5 text-sm outline-none focus:border-[#E3963E]"
                      />
                      <label className="mt-2 block text-xs font-semibold text-[#5F5A50]">
                        Proof image (optional)
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) =>
                            setProof(event.target.files?.[0] ?? null)
                          }
                          className="mt-1 block w-full text-xs font-normal"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => void submitClaim(item)}
                        className="mt-3 flex items-center gap-2 rounded-lg bg-[#E3963E] px-3 py-2 text-xs font-semibold text-white"
                      >
                        <Send size={13} /> Submit claim
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setClaimingId(item.id)}
                      className="mt-5 w-full rounded-lg bg-[#1B2430] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#26313F] focus:outline-none focus:ring-2 focus:ring-[#E3963E] focus:ring-offset-2"
                    >
                      This is mine
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </ClientPage>
  );
}
