import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconBooks } from "@tabler/icons-react";
import { toast } from "../../lib/toast";
import { getMyBorrowings, returnBook } from "../../services/api";
import type { Borrowing } from "../../types/library";
import { CURRENT_USER_ID } from "../../utils/current-user";
import { getErrorMessage } from "../../utils/get-error-message";
import { Icon } from "../shared/Icon";

export function MyBorrowings() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    data: borrowings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myBorrowings", CURRENT_USER_ID],
    queryFn: () => getMyBorrowings(CURRENT_USER_ID),
    enabled: isOpen,
  });

  const {
    mutate: giveBack,
    isPending,
    variables: returning,
  } = useMutation({
    mutationFn: (borrowing: Borrowing) => returnBook(borrowing.id),
    onSuccess: (_data, borrowing) => {
      queryClient.invalidateQueries({ queryKey: ["myBorrowings"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["searchBooks"] });
      toast.success(`"${borrowing.book?.title ?? "Book"}" returned`);
    },
    onError: (error) => {
      toast.error("Could not return book", { description: getErrorMessage(error) });
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const count = borrowings?.length ?? 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative shrink-0 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        aria-label="My borrowings"
      >
        <Icon icon={IconBooks} size={20} />
        {isOpen && count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            My Borrowings
          </p>

          {isLoading && (
            <p className="p-2 text-sm text-gray-500 dark:text-gray-400">Loading…</p>
          )}

          {isError && (
            <p className="p-2 text-sm text-red-600 dark:text-red-400">{getErrorMessage(error)}</p>
          )}

          {!isLoading && !isError && borrowings?.length === 0 && (
            <p className="p-2 text-sm text-gray-500 dark:text-gray-400">
              You have no books borrowed right now.
            </p>
          )}

          {!isLoading && !isError && borrowings && borrowings.length > 0 && (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {borrowings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 p-2">
                  <div className="min-w-0 text-start">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {b.book?.title ?? "Unknown book"}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      Borrowed {new Date(b.borrowedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => giveBack(b)}
                    disabled={isPending && returning?.id === b.id}
                    className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {isPending && returning?.id === b.id ? "Returning…" : "Return"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
