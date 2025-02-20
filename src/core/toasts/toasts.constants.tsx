import { ConfirmationToast } from "./components/ConfirmationToast";
import { ToastData, ToastIds } from "./toasts.types";

/**
 * A constant object that maps toast IDs to their corresponding React functional components.
 * Each key in the object is a toast ID from the `ToastIds` enum, and the value is a React functional component
 * that takes `BaseToastProps` with the specific toast data type.
 *
 * @typeParam K - A key from the `ToastIds` enum.
 * @typeParam ToastData - An object that maps each toast ID to its corresponding data type.
 */
export const toasts: { [K in ToastIds]: React.FC<ToastData[K]> } = {
  [ToastIds.CONFIRMATION]: ConfirmationToast,
};
