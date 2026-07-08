import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import NoticeModal from "../components/NoticeModal";
import NoticeCard from "../components/NoticeCard";

const SkeletonCard = () => (
  <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-5">
    <div className="h-4 w-16 rounded bg-gray-100" />
    <div className="mt-4 h-5 w-3/4 rounded bg-gray-100" />
    <div className="mt-3 space-y-2">
      <div className="h-3 w-full rounded bg-gray-100" />
      <div className="h-3 w-5/6 rounded bg-gray-100" />
      <div className="h-3 w-2/3 rounded bg-gray-100" />
    </div>
    <div className="mt-5 flex gap-2">
      <div className="h-5 w-16 rounded bg-gray-100" />
      <div className="h-5 w-20 rounded bg-gray-100" />
    </div>
    <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
      <div className="h-8 w-16 rounded bg-gray-100" />
      <div className="h-8 w-16 rounded bg-gray-100" />
    </div>
  </div>
);

export default function HomePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // null = modal closed, {} = add mode, {...notice} = edit mode
  const [activeNotice, setActiveNotice] = useState(null);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/notices");
      setNotices(response.data?.data ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching notices.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const categories = useMemo(() => {
    const unique = new Set(notices.map((n) => n.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [notices]);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchesSearch = notice.title
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || notice.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [notices, searchTerm, categoryFilter]);

  const handleEdit = useCallback((notice) => {
    setActiveNotice(notice);
  }, []);

  const handleAddNew = useCallback(() => {
    setActiveNotice({});
  }, []);

  const handleSaveNotice = useCallback(async (noticeData) => {
    if (noticeData.id) {
      const response = await axios.put(
        `/api/notices/${noticeData.id}`,
        noticeData,
      );
      const saved = response.data?.data ?? noticeData;
      setNotices((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
    } else {
      const response = await axios.post("/api/notices", noticeData);
      const saved = response.data?.data ?? noticeData;
      setNotices((prev) => [saved, ...prev]);
    }
    setActiveNotice(null);
  }, []);

  const handleDelete = useCallback(async (notice) => {
    const confirmed = window.confirm(
      `Delete "${notice.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setActionError(null);
    setDeletingId(notice.id);
    try {
      await axios.delete(`/api/notices/${notice.id}`);
      setNotices((prev) => prev.filter((n) => n.id !== notice.id));
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Failed to delete the notice. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Notice Board
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {notices.length} total notice{notices.length === 1 ? "" : "s"}
              {filteredNotices.length !== notices.length &&
                ` · ${filteredNotices.length} shown`}
            </p>
          </div>

          <div className="flex gap-2 self-start">
            <button
              type="button"
              onClick={fetchNotices}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>

            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Notice
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notices..."
              aria-label="Search notices"
              className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchNotices}
              className="shrink-0 font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {actionError && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredNotices.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              {notices.length === 0
                ? "No notices found."
                : "No notices match your search or filter."}
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === notice.id}
              />
            ))
          )}
        </section>
      </div>

      {activeNotice && (
        <NoticeModal
          notice={activeNotice}
          onClose={() => setActiveNotice(null)}
          onSave={handleSaveNotice}
        />
      )}
    </div>
  );
}
