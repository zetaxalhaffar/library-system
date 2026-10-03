import type { Book, Borrowing } from "../types/library";

export const books: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    available: true,
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "9780135957059",
    available: true,
  },
  { id: 3, title: "Refactoring", author: "Martin Fowler", isbn: "9780134757599", available: false },
  {
    id: 4,
    title: "Design Patterns",
    author: "Erich Gamma",
    isbn: "9780201633610",
    available: true,
  },
  {
    id: 5,
    title: "You Don’t Know JS",
    author: "Kyle Simpson",
    isbn: "9781491904244",
    available: true,
  },
  {
    id: 6,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    isbn: "9781593279509",
    available: true,
  },
  {
    id: 7,
    title: "Domain-Driven Design",
    author: "Eric Evans",
    isbn: "9780321125217",
    available: false,
  },
  {
    id: 8,
    title: "Head First Design Patterns",
    author: "Eric Freeman",
    isbn: "9781492078005",
    available: true,
  },
];

export const borrowings: Borrowing[] = [
  { id: 1, bookId: 3, userId: 1, borrowedAt: new Date().toISOString(), returnedAt: null },
  { id: 2, bookId: 7, userId: 2, borrowedAt: new Date().toISOString(), returnedAt: null },
];

export const users = [
  { id: 1, name: "Yazan" },
  { id: 2, name: "Sara" },
];
