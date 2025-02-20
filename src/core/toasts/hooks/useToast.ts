// Dependencies
import { create } from "zustand";

import { generateRandomKey } from "@/lib/string";

import { Toast, ToastData, ToastIds, ToastState } from "../toasts.types";

/**
 * Type representing the properties and methods for the useToast hook.
 *
 * @extends {ToastState<ToastIds>}
 * @property {<K extends ToastIds>(id: K, data: ToastData[K]) => void} createToast - Function to create a toast with a specified identifier and associated data.
 * @property {(key: Toast["key"]) => void} deleteToast - Function to delete a toast by its key.
 */
type UseToastProps = ToastState<ToastIds> & {
  createToast: <K extends ToastIds>(id: K, data: ToastData[K], timeout?: number) => void;
  deleteToast: (key: Toast<ToastIds>["key"]) => void;
};

/**
 * Custom hook for managing toast notifications.
 *
 * Provides functionality to create and delete toast notifications with associated data.
 *
 * @returns {{ toasts: Record<string, ToastData[ToastIds]>, createToast: <K extends ToastIds>(id: K, data: ToastData[K]) => void, deleteToast: (key: Toast["key"]) => void }} The current toast state and methods to manipulate it.
 */
export const useToast = create<UseToastProps>((set) => ({
  toasts: {},

  /**
   * Adds a new toast notification with a unique key and specified data.
   *
   * @param {K} id - The identifier for the toast being added.
   * @param {ToastData[K]} data - The content associated with the toast.
   */
  createToast: <K extends ToastIds>(id: K, data: ToastData[K], timeout?: number) => {
    const randomKey = generateRandomKey(6);
    set((state) => ({
      toasts: {
        ...state.toasts,
        [randomKey]: { id, data, timeout: timeout ?? 3000 },
      },
    }));
  },

  /**
   * Deletes a toast by its key.
   *
   * @param {Toast["key"]} key - The key of the toast to delete.
   */
  deleteToast: (key: Toast<ToastIds>["key"]) =>
    set((state) => {
      const remainingToasts = { ...state.toasts };
      delete remainingToasts[key];
      return { toasts: remainingToasts };
    }),
}));

export { ToastIds };
