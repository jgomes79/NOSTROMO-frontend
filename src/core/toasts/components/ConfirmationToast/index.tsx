import classNames from "clsx";

import { Typography } from "@/shared/components/Typography";

import { icons } from "./ConfirmationToast.constants";
import styles from "./ConfirmationToast.module.scss";

/**
 * Props for the ConfirmationToast component.
 *
 * @interface ConfirmationToastProps
 * @property {("success" | "warning" | "info" | "error")} type - The type of toast, which determines the icon and styling.
 * @property {string} title - The title of the toast message.
 * @property {string} [description] - An optional description providing additional information about the toast.
 */
export interface ConfirmationToastProps {
  type: "success" | "warning" | "info" | "error";
  title: string;
  description?: string;
}

/**
 * ConfirmationToast component displays a toast notification with an icon, title, and optional description.
 *
 * @component
 * @param {ConfirmationToastProps} props - The properties for the ConfirmationToast component.
 * @returns {JSX.Element} The rendered ConfirmationToast component.
 */
export const ConfirmationToast: React.FC<ConfirmationToastProps> = ({ type, title, description }) => {
  return (
    <div className={classNames(styles.layout, styles[type])}>
      {icons[type]}
      <div className={styles.content}>
        <Typography as="h3" variant="heading" size={"small"}>
          {title}
        </Typography>
        {description && (
          <Typography as="p" variant="body" size={"small"}>
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
};
