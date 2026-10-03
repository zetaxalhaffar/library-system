import { IconMoodSad2 } from "@tabler/icons-react";
import { Link } from "react-router";
import { Icon } from "../../components/shared/Icon";

export function NotFoundPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <Icon icon={IconMoodSad2} size={48} className="text-gray-400 dark:text-gray-600" />
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-gray-600 dark:text-gray-400">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
        doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
      >
        Go back home
      </Link>
    </section>
  );
}
