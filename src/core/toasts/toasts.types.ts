import { ConfirmationToastProps } from "./components/ConfirmationToast";

/**
 * Represents a toast notification.
 *
 * @typedef {Object} Toast
 * @property {string} key - A unique identifier for the toast notification.
 */
export type Toast<T extends ToastIds> = {
  key: string;
  id: T;
};

/**
 * Represents an list in the toast notification system.
 *
 * @template T - The type of toast identifier, extending from ToastIds.
 * @typedef {Object} ToastItem
 * @property {string} key - The unique key for the toast notification.
 * @property {ToastIds} id - The identifier of the toast.
 * @property {ToastData[T]} data - The data associated with the toast.
 * @property {number} [timeout] - Optional timeout duration for the toast notification.
 */
export type ToastList<T extends ToastIds> = Record<
  Toast<T>["key"],
  { id: Toast<T>["id"]; data: ToastData[T]; timeout?: number }
>;

/**
 * Represents the state of a toast.
 *
 * @template T - The type of toast identifier.
 * @typedef {Object} ToastState
 * @property {T | null} id - The identifier of the toast, which can be null if no toast is active.
 * @property {ToastData[T] | null} data - The data associated with the toast, which can be null if no toast is active.
 */
export interface ToastState<T extends ToastIds> {
  toasts: ToastList<T>;
}

/**
 * Enum representing the different types of toast identifiers.
 *
 * @enum {string}
 */
export enum ToastIds {
  CONFIRMATION = "confirmation-toast",
}

/**
 * Represents the mapping of toast identifiers to their respective data structures.
 *
 * @typedef {Object} ToastData
 * @property {ConfirmationToastProps} [ToastIds.CONFIRMATION] - The data structure for the confirmation toast.
 */
export type ToastData = {
  [ToastIds.CONFIRMATION]: ConfirmationToastProps;
};
