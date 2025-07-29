import { ConfirmationModal } from "@/shared/modals/ConfirmationModal";
import { ConnectModal } from "@/wallet/modals/ConnectModal";

import { BaseModalProps, ModalData, ModalsIds } from "./modals.types";

/**
 * A constant object that maps modal IDs to their corresponding React functional components.
 * Each key in the object is a modal ID from the `ModalsIds` enum, and the value is a React functional component
 * that takes `BaseModalProps` with the specific modal data type.
 *
 * @typeParam K - A key from the `ModalsIds` enum.
 * @typeParam ModalData - An object that maps each modal ID to its corresponding data type.
 */
export const modals: { [K in ModalsIds]: React.FC<BaseModalProps<ModalData[K]>> } = {
  [ModalsIds.CONFIRMATION]: ConfirmationModal,
  [ModalsIds.CONNECT]: ConnectModal,
};
