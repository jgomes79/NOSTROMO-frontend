import { useCallback } from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { Button } from "../../../shared/components/Button";
import { Fieldset } from "../../../shared/components/Fieldset";
import { Typography } from "../../../shared/components/Typography";

import { useModal } from "../../../core/modals/hooks/useModal";
import { ModalsIds } from "../../../core/modals/modals.types";
import { usePublishProject } from "../../../project/hooks/usePublishProject";
import { Project } from "../../project.types";
import styles from "./ProjectPendingToCreate.module.scss";

/**
 * Props for the ProjectPendingToCreate component.
 * @param {Project} project - The project to be published.
 */
interface ProjectPendingToCreateProps {
  project: Project;
  onPublish: () => Promise<void>;
}

/**
 * Component to display a project that is pending to be created.
 * @param {ProjectPendingToCreateProps} props - The props for the component.
 * @returns {React.ReactNode} The component to be rendered.
 */
export const ProjectPendingToCreate: React.FC<ProjectPendingToCreateProps> = ({ project, onPublish }) => {
  const publishProject = usePublishProject();
  const { openModal, closeModal } = useModal();

  /**
   * Handles the click event to publish the project.
   * @returns {Promise<void>} A promise that resolves when the project is published.
   */
  const handleClickPublish = useCallback(async () => {
    console.log("🚀 project:", project);
    if (project.smartContractId) {
      return new Error("SmartcontractId already exists");
    }

    openModal(ModalsIds.CONFIRMATION, {
      title: "Create Project and start voting",
      description:
        "Are you sure you want to create this project and start voting? This action cannot be undone and the voting will start in 1 hour.",
      type: "info",
      onConfirm: {
        caption: "Confirm and start voting",
        action: async (setLoading) => {
          setLoading(true);
          await publishProject.mutateAsync(project);
          await onPublish();
          closeModal();
        },
      },
      onDecline: {
        caption: "Cancel",
        action: () => {
          closeModal();
        },
      },
    });
  }, [openModal, closeModal, project]);

  return (
    <Fieldset title={"Creation Phase"} variant={"default"}>
      <div className={styles.container}>
        <RiCheckboxCircleLine size={52} className={styles.green} />
        <div className={styles.content}>
          <Typography as={"h1"} variant={"heading"} size={"large"} textAlign={"center"} className={styles.green}>
            Project ready to publish!
          </Typography>
          <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.gray}>
            Your project has been approved by the community and is ready to be published.
            <br />
            Click the button to complete the process.
          </Typography>
        </div>
        <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"}>
          <Button onClick={handleClickPublish} caption="Publish Project" isLoading={publishProject.isPending} />
        </Typography>
      </div>
    </Fieldset>
  );
};
