const priorityStyles = {
  URGENT: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  NORMAL: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
};

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

export default function NoticeCard({ notice, onEdit, onDelete, isDeleting }) {
  const priority = priorityStyles[notice.priority] ?? {
    dot: "bg-gray-400",
    text: "text-gray-700",
    bg: "bg-gray-50",
  };

  const displayDate = formatDate(notice.updatedAt || notice.createdAt);

  return (
    <article
      className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
      aria-labelledby={`notice-title-${notice.id}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium ${priority.bg} ${priority.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {notice.priority}
        </span>
        {displayDate && (
          <span className="text-xs text-gray-400">{displayDate}</span>
        )}
      </div>

      <div className="mt-3 flex-1">
        <h2
          id={`notice-title-${notice.id}`}
          className="text-base font-semibold text-gray-900"
        >
          {notice.title}
        </h2>
        <p
          className="mt-1.5 text-sm leading-6 text-gray-500"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {notice.body}
        </p>
      </div>

      <div className="mt-4">
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {notice.category}
        </span>
      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit?.(notice)}
          aria-label={`Edit notice: ${notice.title}`}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(notice)}
          disabled={isDeleting}
          aria-label={`Delete notice: ${notice.title}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting && (
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
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}