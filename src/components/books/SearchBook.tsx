import { IconSearch } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "../../lib/toast";
import { borrowBook, searchBooks } from "../../services/api";
import { CURRENT_USER_ID } from "../../utils/current-user";
import { getErrorMessage } from "../../utils/get-error-message";
import { useDebouncedValue } from "../../utils/use-debounced-value";
import { Icon } from "../shared/Icon";

export function SearchBook() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query).trim();
  const queryClient = useQueryClient();

  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchBooks", debouncedQuery],
    queryFn: () => searchBooks(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const {
    mutate: borrow,
    isPending: isBorrowing,
    variables: borrowingBookId,
  } = useMutation({
    mutationFn: (bookId: number) => borrowBook(bookId, CURRENT_USER_ID),
    onSuccess: (_data, bookId) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["searchBooks"] });
      const title = results?.find((b) => b.id === bookId)?.title ?? "Book";
      toast.success(`"${title}" borrowed`, { description: "Enjoy your reading!" });
    },
    onError: (error) => {
      toast.error("Could not borrow book", { description: getErrorMessage(error) });
    },
  });

  const isOpen = debouncedQuery.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative">
        <Icon
          icon={IconSearch}
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:bg-gray-900"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full z-10 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          {isLoading && <p className="p-2 text-sm text-gray-500 dark:text-gray-400">Searching…</p>}

          {isError && (
            <p className="p-2 text-sm text-red-600 dark:text-red-400">
              {(error as { message?: string })?.message ?? "Search failed."}
            </p>
          )}

          {!isLoading && !isError && results?.length === 0 && (
            <p className="p-2 text-sm text-gray-500 dark:text-gray-400">
              No books found for &quot;{debouncedQuery}&quot;.
            </p>
          )}

          {!isLoading && !isError && results && results.length > 0 && (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {results.map((book) => (
                <li key={book.id} className="flex items-center justify-between gap-3 p-2">
                  <div className="min-w-0 text-start">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {book.title}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {book.author} · ISBN {book.isbn}
                    </p>
                  </div>
                  {book.available ? (
                    <button
                      type="button"
                      onClick={() => borrow(book.id)}
                      disabled={isBorrowing && borrowingBookId === book.id}
                      className="shrink-0 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBorrowing && borrowingBookId === book.id ? "Borrowing…" : "Borrow"}
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      Checked out
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
