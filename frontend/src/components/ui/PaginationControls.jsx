export default function PaginationControls({
  pagination,
  onPageChange,
  isDisabled = false,
}) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const buttonClassName =
    "inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:border-zinc-300 hover:text-zinc-950";

  return (
    <div className="flex flex-col gap-4 border-t border-zinc-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-zinc-500">
        Page <span className="font-medium text-zinc-950">{pagination.page}</span> of{" "}
        <span className="font-medium text-zinc-950">{pagination.totalPages}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className={buttonClassName}
          disabled={!pagination.hasPrevPage || isDisabled}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </button>

        <button
          type="button"
          className={buttonClassName}
          disabled={!pagination.hasNextPage || isDisabled}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
