import { books, borrowings } from "../_mock/db";
import type { Book, Borrowing } from "../types/library";

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const fail = (status: number, message: string) => Promise.reject({ status, message });

// ---------- mock ----------
const mockApi = {
  async getBooks(): Promise<Book[]> {
    await wait();
    return books.map((b) => ({ ...b }));
  },

  async searchBooks(q: string): Promise<Book[]> {
    await wait();
    if (!q.trim()) return fail(400, "Search term is required.");
    const needle = q.trim().toLowerCase();
    const needleNoDashes = needle.replace(/-/g, "");
    return books
      .filter(
        (b) =>
          b.title.toLowerCase().includes(needle) ||
          b.author.toLowerCase().includes(needle) ||
          b.isbn.toLowerCase().includes(needleNoDashes),
      )
      .map((b) => ({ ...b }));
  },

  async borrowBook(bookId: number, userId: number): Promise<Borrowing> {
    await wait();
    const book = books.find((b) => b.id === bookId);
    if (!book) return fail(404, "Book not found.");
    if (!book.available) return fail(409, "This book is currently checked out.");

    book.available = false;
    const borrowing = {
      id: Date.now(),
      bookId,
      userId,
      borrowedAt: new Date().toISOString(),
      returnedAt: null,
    };
    borrowings.push(borrowing);
    return borrowing;
  },

  async returnBook(borrowingId: number): Promise<Borrowing> {
    await wait();
    const b = borrowings.find((x) => x.id === borrowingId);
    if (!b) return fail(404, "Borrowing not found.");
    if (b.returnedAt) return fail(409, "This book was already returned.");

    b.returnedAt = new Date().toISOString();
    const book = books.find((x) => x.id === b.bookId);
    if (book) book.available = true;
    return b;
  },

  async getMyBorrowings(userId: number): Promise<Borrowing[]> {
    await wait(300);
    return borrowings
      .filter((b) => b.userId === userId && !b.returnedAt)
      .map((b) => {
        const book = books.find((x) => x.id === b.bookId);
        return { ...b, book: book ? { ...book } : undefined };
      });
  },
};

export const { getBooks, searchBooks, borrowBook, returnBook, getMyBorrowings } = mockApi;
