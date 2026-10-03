import { IconBrandGithub } from "@tabler/icons-react";
import { MyBorrowings } from "../books/MyBorrowings";
import { SearchBook } from "../books/SearchBook";
import { Icon } from "../shared/Icon";

export function Navbar() {
  return (
    <header className="flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-950">
      <a
        href="/"
        className="flex shrink-0 items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100"
      >
        <span>Library System</span>
      </a>

      <div className="mx-auto w-full max-w-md">
        <SearchBook />
      </div>

      <MyBorrowings />

      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        aria-label="GitHub"
      >
        <Icon icon={IconBrandGithub} size={20} />
      </a>
    </header>
  );
}
