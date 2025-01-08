import { Card } from "@/shared/components/Card";
import { Loader } from "@/shared/components/Loader";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectEvaluation.module.scss";

/**
 * ProjectEvaluation component renders the project evaluation section.
 *
 * @returns {JSX.Element} The JSX code for ProjectEvaluation component.
 */
export const ProjectEvaluation: React.FC = () => {
  return (
    <Card>
      <div className={styles.layout}>
        <Loader size={42} />
        <div className={styles.field}>
          <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
            Pendiente de revision
          </Typography>
          <Typography as={"h2"} variant={"body"} size={"medium"} textAlign={"center"}>
            Este proyecto se encuentra pendiente de revision, el mismo sera evaluado por el equipo de mostromo antes de
            ser oficializado para el resto de la comunidad.
          </Typography>
        </div>
      </div>
    </Card>
  );
};
