import { gooeyToast } from "goey-toast";
import type { GooeyToastOptions } from "goey-toast";

export const toast = {
  success: (title: string, options?: GooeyToastOptions) =>
    gooeyToast.success(title, { preset: "smooth", ...options }),
  error: (title: string, options?: GooeyToastOptions) =>
    gooeyToast.error(title, { preset: "smooth", ...options }),
};
