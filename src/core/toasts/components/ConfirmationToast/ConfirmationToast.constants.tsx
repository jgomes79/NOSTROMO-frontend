import { RiCheckLine, RiAlertLine, RiInformationLine, RiCloseLine } from "react-icons/ri";

import { ConfirmationToastProps } from ".";

/**
 * The size of the icons used in the confirmation modal.
 * @constant {number}
 */
export const iconSize = 32;

/**
 * A mapping of modal types to their corresponding icons.
 * @type {Record<NonNullable<ConfirmationModalProps["type"]>, React.ReactNode>}
 */
export const icons: Record<NonNullable<ConfirmationToastProps["type"]>, React.ReactNode> = {
  success: <RiCheckLine size={iconSize} />,
  warning: <RiAlertLine size={iconSize} />,
  info: <RiInformationLine size={iconSize} />,
  error: <RiCloseLine size={iconSize} />,
};
