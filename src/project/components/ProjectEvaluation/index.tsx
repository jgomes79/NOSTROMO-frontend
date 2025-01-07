import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectEvaluation.module.scss";

/**
 * ProjectEvaluation component renders the project evaluation section.
 *
 * @returns {JSX.Element} The JSX code for ProjectEvaluation component.
 */
export const ProjectEvaluation: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Typography as={"h2"} variant={"heading"} size={"large"}>
        Este proyecto esta pendiente de revision
      </Typography>
    </div>
  );
};
