import React, { useState } from "react";

import classNames from "clsx";

import { Button, ButtonProps } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Typography } from "@/shared/components/Typography";

import { icons, primaryVariant, primaryColor, secondaryVariant, secondaryColor } from "./ConfirmationModal.constants";
import styles from "./ConfirmationModal.module.scss";

/**
 * Type representing an action for the confirmation modal.
 *
 * @typedef {Object} Action
 * @property {string} caption - The caption to be displayed on the button.
 * @property {string} variant - The variant style of the button.
 * @property {string} size - The size of the button.
 * @property {() => void} action - The function to be executed when the button is clicked.
 */
type Action = Pick<ButtonProps, "caption"> & {
  action: (setLoading: (loading: boolean) => void) => void;
};

/**
 * Props for the ConfirmationModal component.
 *
 * @interface ConfirmationModalProps
 * @property {"success" | "warning" | "info" | "error"} type - The type of the modal.
 * @property {string} title - The title to be displayed in the modal.
 * @property {string} description - The description to be displayed in the modal.
 * @property {React.ReactNode} [element] - An optional additional element to be rendered in the modal.
 * @property {Action} [onConfirm] - An optional action to be executed when the confirm button is clicked.
 * @property {Action} [onDecline] - An optional action to be executed when the decline button is clicked.
 */
export interface ConfirmationModalProps {
  readonly type?: "success" | "warning" | "info" | "error";
  readonly title: string;
  readonly description: string;
  readonly element?: React.ReactNode | ((isLoading: boolean) => React.ReactNode);
  readonly onConfirm?: Action;
  readonly onDecline?: Action;
}

/**
 * ConfirmationModal component that displays a title, description, and an optional element.
 *
 * @param {ConfirmationModalProps} props - The properties for the ConfirmationModal component.
 * @returns {JSX.Element} The rendered ConfirmationModal component.
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  type = "success",
  title,
  description,
  element,
  onConfirm,
  onDecline,
}) => {
  const [loadingState, setLoadingState] = useState<boolean[]>([false, false]);

  /**
   * Handles the loading state for the specified button index.
   *
   * This function returns a callback that updates the loading state
   * for a button in the confirmation modal. It takes an index to identify
   * which button's loading state to update.
   *
   * @param {number} index - The index of the button whose loading state is to be updated.
   * @returns {(loading: boolean) => void} A callback function that takes a loading state
   * and updates the corresponding button's loading state.
   */
  const handleLoading = (index: number) => (loading: boolean) => {
    const newLoadingState = [...loadingState];
    newLoadingState[index] = loading;
    setLoadingState(newLoadingState);
  };

  return (
    <Card className={classNames(styles.layout, styles[type])}>
      <div className={styles.content}>
        <div className={styles.header}>
          {icons[type]}
          <div className={styles.title}>
            <Typography variant={"heading"} size={"medium"}>
              {title}
            </Typography>
            <Typography as={"p"} variant={"body"} size={"medium"}>
              {description}
            </Typography>
          </div>
        </div>
        {element && typeof element === "function" ? element(loadingState[0]) : element}
      </div>

      <div className={styles.actions}>
        {onConfirm && (
          <Button
            onClick={() => onConfirm.action(handleLoading(0))}
            isLoading={loadingState[0]}
            caption={onConfirm.caption}
            variant={primaryVariant[type]}
            color={primaryColor[type]}
            className={styles.button}
          />
        )}
        {onDecline && (
          <Button
            onClick={() => onDecline.action(handleLoading(1))}
            isLoading={loadingState[1]}
            caption={onDecline.caption}
            variant={secondaryVariant[type]}
            color={secondaryColor[type]}
          />
        )}
      </div>
    </Card>
  );
};
