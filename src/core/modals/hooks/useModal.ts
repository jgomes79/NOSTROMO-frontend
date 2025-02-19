// Dependencies
import { create } from "zustand";

import { ModalData, ModalState, ModalsIds } from "../modals.types";

/**
 * The initial state for the modal.
 *
 * @type {ModalState<ModalsIds>}
 * @property {ModalsIds | null} id - The identifier for the modal, initially set to null.
 * @property {ModalData[ModalsIds] | null} data - The data associated with the modal, initially set to null.
 */
const initialState: ModalState<ModalsIds> = {
  id: null,
  data: null,
};

/**
 * Type representing the properties and methods for the useModal hook.
 *
 * @extends {ModalState<ModalsIds>}
 * @property {<K extends ModalsIds>(id: K, data: ModalData[K]) => void} openModal - Function to open a modal with specified identifier and data.
 * @property {() => void} closeModal - Function to close the currently open modal and reset the state.
 */
type UseModalProps = ModalState<ModalsIds> & {
  openModal: <K extends ModalsIds>(id: K, data?: ModalData[K]) => void;
  closeModal: () => void;
};

/**
 * Custom hook for managing modals.

 * Provides functionality to open and close modals with associated data.
 *
 * @returns {{ id: ModalsIds | null, data: ModalData[ModalsIds] | null, openModal: <K extends ModalsIds>(id: K, data: ModalData[K]) => void, closeModal: () => void }} The modal state and control methods.
 */
export const useModal = create<UseModalProps>((set) => ({
  id: null, // The current modal identifier, initially null.
  data: null, // The data associated with the current modal, initially null.

  /**
   * Opens a modal with specified identifier and data.
   *
   * @param {K} id - The identifier of the modal to open.
   * @param {ModalData[K]} data - The data to associate with the modal.
   */
  openModal: (id, data) => set(() => ({ id, data: data ?? null })),

  /**
   * Closes the currently open modal and resets the state.
   */
  closeModal: () => set(() => ({ ...initialState })),
}));
