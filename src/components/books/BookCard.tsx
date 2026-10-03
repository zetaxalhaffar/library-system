import { IconBook } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../lib/toast";
import { borrowBook } from "../../services/api";
import type { Book } from "../../types/library";
import { CURRENT_USER_ID } from "../../utils/current-user";
import { getErrorMessage } from "../../utils/get-error-message";
import { Icon } from "../shared/Icon";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const queryClient = useQueryClient();

  const { mutate: borrow, isPending } = useMutation({
    mutationFn: () => borrowBook(book.id, CURRENT_USER_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["searchBooks"] });
      toast.success(`"${book.title}" borrowed`, {
        description: "Enjoy your reading!",
      });
    },
    onError: (error) => {
      toast.error("Could not borrow book", { description: getErrorMessage(error) });
    },
  });

  return (
    <div className="flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:bg-[#1c1c1e]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]">
          <Icon icon={IconBook} size={22} />
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
            book.available
              ? "bg-[#34C759]/10 text-[#248A3D] dark:bg-[#30D158]/15 dark:text-[#30D158]"
              : "bg-black/5 text-gray-500 dark:bg-white/10 dark:text-gray-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              book.available ? "bg-[#34C759] dark:bg-[#30D158]" : "bg-gray-400"
            }`}
          />
          {book.available ? "Available" : "Checked out"}
        </span>
      </div>

      <div>
        <h3 className="line-clamp-2 text-[17px] font-semibold tracking-tight text-gray-900 dark:text-white">
          {book.title}
        </h3>
        <p className="mt-0.5 text-[15px] text-gray-500 dark:text-gray-400">{book.author}</p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-3 text-[13px] text-gray-400 dark:border-white/10 dark:text-gray-500">
        <span>ISBN</span>
        <span className="font-mono tracking-tight text-gray-500 dark:text-gray-400">
          {book.isbn}
        </span>
      </div>

      {book.available && (
        <button
          type="button"
          onClick={() => borrow()}
          disabled={isPending}
          className="w-full rounded-full bg-[#007AFF] py-2.5 text-[15px] font-semibold text-white transition-all active:scale-[0.97] active:bg-[#006EE6] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#0A84FF] dark:active:bg-[#0974DB]"
        >
          {isPending ? "Borrowing…" : "Borrow"}
        </button>
      )}
    </div>
  );
}
