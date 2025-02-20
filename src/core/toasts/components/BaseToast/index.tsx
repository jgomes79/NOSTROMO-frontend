import { useDebounce } from "react-use";

import { motion } from "framer-motion";

import styles from "./BaseToast.module.scss";
import { useToast } from "../../hooks/useToast";

/**
 * Props for the BaseToast component.
 * @property {React.ReactNode} children - The content to be displayed inside the toast.
 */
export interface BaseToastProps {
  refKey: string;
  timeout?: number;
  children: React.ReactNode;
}

/**
 * A functional component that renders a toast notification.
 *
 * @param {BaseToastProps} props - The props for the component.
 * @returns {JSX.Element} The rendered toast component.
 */
export const BaseToast: React.FC<BaseToastProps> = ({ refKey, children, timeout = 3000 }) => {
  const { deleteToast } = useToast();

  const handleClose = () => {
    if (timeout) {
      deleteToast(refKey);
    }
  };

  useDebounce(handleClose, timeout);

  return (
    <button onClick={handleClose} className={styles.layout}>
      <div className={styles.content}>{children}</div>

      {timeout && (
        <div className={styles.indicator}>
          <motion.div
            className={styles.bar}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: timeout / 1000 }}
          />
        </div>
      )}
    </button>
  );
};
