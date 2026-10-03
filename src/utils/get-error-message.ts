export function getErrorMessage(error: unknown): string {
  const e = error as { status?: number; message?: string };

  if (e?.message === "Request was cancelled") return "";
  if (e?.status === undefined) return "Can't reach the server. Check your connection and try again.";
  if (e.status >= 500) return "Something went wrong on our side. Please try again later.";
  return e.message ?? "Unexpected error.";
}
