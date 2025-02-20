import { AnimatePresence, motion } from "framer-motion";

import styles from "./ToastsList.module.scss";
import { toasts } from "../../toasts.constants";
import { ToastIds, ToastList } from "../../toasts.types";
import { BaseToast } from "../BaseToast";

/**
 * Props for the ToastsList component.
 *
 * @interface ToastsListProps
 * @property {React.ReactNode[]} toasts - An array of toast elements to be displayed.
 */
interface ToastsListProps<T extends ToastIds> {
  data: ToastList<T>;
}

/**
 * A component that renders a list of toast notifications.
 *
 * @param {ToastsListProps} props - The props for the component.
 * @returns {JSX.Element} The rendered list of toasts.
 */
export const ToastsList: React.FC<ToastsListProps<ToastIds>> = ({ data = {} }) => {
  return (
    <div className={styles.layout}>
      <AnimatePresence>
        {Object.keys(data).map((key) => {
          const toast = data[key],
            Component = toasts[toast.id];

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BaseToast key={`--toast-${key}`} refKey={key} timeout={toast.timeout}>
                <Component key={key} {...toast.data} />
              </BaseToast>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
