import { useQuery } from "@tanstack/react-query";
import { BookCard } from "../../components/books/BookCard";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { getBooks } from "../../services/api";

export function BooksPage() {
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: () => getBooks(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <p className="p-6 text-center text-sm text-red-600 dark:text-red-400">
        Failed to load books{error instanceof Error ? `: ${error.message}` : ""}
      </p>
    );
  }

  return (
    <section className="p-6">
      <h1 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Books</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
