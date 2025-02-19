import { RiCheckLine, RiAlertLine, RiInformationLine, RiCloseLine } from "react-icons/ri";

import { ButtonProps } from "@/shared/components/Button";

import { ConfirmationModalProps } from ".";

/**
 * The size of the icons used in the confirmation modal.
 * @constant {number}
 */
export const iconSize = 48;

/**
 * A mapping of modal types to their corresponding icons.
 * @type {Record<NonNullable<ConfirmationModalProps["type"]>, React.ReactNode>}
 */
export const icons: Record<NonNullable<ConfirmationModalProps["type"]>, React.ReactNode> = {
  success: <RiCheckLine size={iconSize} />,
  warning: <RiAlertLine size={iconSize} />,
  info: <RiInformationLine size={iconSize} />,
  error: <RiCloseLine size={iconSize} />,
};

/**
 * A mapping of modal types to their corresponding primary button colors.
 * @type {Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["color"]>}
 */
export const primaryColor: Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["color"]> = {
  info: "primary",
  error: "error",
  success: "primary",
  warning: "warning",
};

/**
 * A mapping of modal types to their corresponding secondary button colors.
 * @type {Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["color"]>}
 */
export const secondaryColor: Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["color"]> = {
  info: "neutral",
  error: "neutral",
  success: "neutral",
  warning: "neutral",
};

/**
 * A mapping of modal types to their corresponding primary button variants.
 * @type {Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["variant"]>}
 */
export const primaryVariant: Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["variant"]> = {
  info: "solid",
  error: "solid",
  success: "solid",
  warning: "solid",
};

/**
 * A mapping of modal types to their corresponding secondary button variants.
 * @type {Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["variant"]>}
 */
export const secondaryVariant: Record<NonNullable<ConfirmationModalProps["type"]>, ButtonProps["variant"]> = {
  info: "ghost",
  error: "ghost",
  success: "ghost",
  warning: "ghost",
};
