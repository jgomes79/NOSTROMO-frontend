import { Card } from "@/shared/components/Card";

import styles from "./ProjectRegister.module.scss";

/**
 * ProjectEvaluation component renders the project evaluation section.
 *
 * @returns {JSX.Element} The JSX code for ProjectEvaluation component.
 */
export const ProjectRegister: React.FC = () => {
  return (
    <Card title="Registrarse">
      <div className={styles.layout}></div>
    </Card>
  );
};
