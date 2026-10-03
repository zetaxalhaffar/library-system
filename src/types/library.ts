export interface Book { id: number; title: string; author: string; isbn: string; available: boolean }
export interface Borrowing { id: number; bookId: number; userId: number; borrowedAt: string; returnedAt: string | null; book?: Book }
