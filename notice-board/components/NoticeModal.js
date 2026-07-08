import { useEffect, useState } from "react";

const PRIORITIES = ["NORMAL", "URGENT"];
const CATEGORIES = ["EXAM", "EVENT", "GENERAL"];

export default function NoticeModal({ notice, onClose, onSave }) {
  const isEditMode = Boolean(notice?.id);

  const [title, setTitle] = useState(notice?.title ?? "");
  const [body, setBody] = useState(notice?.body ?? "");
  const [category, setCategory] = useState(notice?.category ?? CATEGORIES[0]);
  const [publishDate, setPublishDate] = useState(
    notice?.publishDate ? notice.publishDate.slice(0, 10) : "",
  );
  const [priority, setPriority] = useState(notice?.priority ?? "NORMAL");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and description are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...notice,
        title: title.trim(),
        body: body.trim(),
        category: category.trim(),
        publishDate: publishDate ? new Date(publishDate).toISOString() : null,
        priority,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} the notice. Please try again.`,
      );
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-modal-heading"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2
            id="notice-modal-heading"
            className="text-base font-semibold text-gray-900"
          >
            {isEditMode ? "Edit notice" : "Add notice"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="notice-title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="notice-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="notice-body"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="notice-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="mt-1 w-full resize-none rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="notice-category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="notice-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="notice-priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </label>
              <select
                id="notice-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="notice-publish-date"
              className="block text-sm font-medium text-gray-700"
            >
              Publish date
            </label>
            <input
              id="notice-publish-date"
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <svg
                  className="h-3.5 w-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {saving
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save changes"
                  : "Create notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
