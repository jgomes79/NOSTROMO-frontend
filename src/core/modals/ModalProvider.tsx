import React from "react";

import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";

import { Backdrop } from "./components/Backdrop";
import { useModal } from "./hooks/useModal";
import { modals } from "./modals.constants";
import { BaseModalProps } from "./modals.types";

/**
 * Properties for the ModalLayout component.
 *
 * @interface ModalProviderProps
 * @property {React.ReactNode} children - The child components to be rendered within the ModalLayout.
 */
interface ModalProviderProps {
  readonly children: React.ReactNode;
}

/**
 * ModalProvider component that provides modal functionality to its children.
 *
 * @param {ModalProviderProps} props - The properties for the ModalProvider component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the ModalProvider.
 * @returns {JSX.Element} The rendered ModalProvider component.
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const { id, data, closeModal: handleClose } = useModal();
  useLockBodyScroll(!!id);

  /**
   * Retrieves the modal content component based on the provided `id`.
   * If the `id` exists in the `modals` object, it returns the corresponding modal component.
   * Otherwise, it returns `null`.
   *
   * @param {string | undefined} id - The identifier for the modal.
   * @param {Record<string, React.FC<BaseModalProps<unknown>>>} modals - An object containing modal components indexed by their identifiers.
   * @returns {React.FC<BaseModalProps<unknown>> | null} The modal component if found, otherwise `null`.
   */
  const ModalContent = id && id in modals ? (modals[id] as React.FC<BaseModalProps<unknown>>) : null;

  return (
    <>
      {ModalContent && id && (
        <Backdrop>
          <ModalContent {...(data ?? {})} handleClose={handleClose} />
        </Backdrop>
      )}
      {children}
    </>
  );
};
