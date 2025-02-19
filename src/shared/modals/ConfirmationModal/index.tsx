import React from "react";

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
  action: () => void;
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
  readonly element?: React.ReactNode;
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
        {element && element}
      </div>

      <div className={styles.actions}>
        {onConfirm && (
          <Button
            onClick={onConfirm.action}
            caption={onConfirm.caption}
            variant={primaryVariant[type]}
            color={primaryColor[type]}
            className={styles.button}
          />
        )}
        {onDecline && (
          <Button
            onClick={onDecline.action}
            caption={onDecline.caption}
            variant={secondaryVariant[type]}
            color={secondaryColor[type]}
          />
        )}
      </div>
    </Card>
  );
};
