import React, { useCallback } from "react";

import { ProjectForm } from "@/project/forms/ProjectForm";
import { useNewProject } from "@/project/hooks/useNewProject";

import styles from "./NewProjectPage.module.scss";
import { ProjectFormValues } from "../../forms/ProjectForm";

/**
 * NewProjectPage component.
 *
 * This component renders the new project page, which includes a form for creating a new project.
 *
 * @returns {JSX.Element} The rendered new project page component.
 */
export const NewProjectPage: React.FC = () => {
  const newProjectMutation = useNewProject();

  /**
   * Handles the submit button click event and triggers the new project mutation with the provided form values.
   *
   * @param {ProjectFormValues} values - The form values from the project form.
   */
  const handleClickSubmit = useCallback(
    (values: ProjectFormValues) => {
      newProjectMutation.mutate(values);
    },
    [newProjectMutation],
  );

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.gradient} />
      </div>
      <div className={styles.form}>
        <ProjectForm
          defaultValues={{
            threshold: 5,
          }}
          onSubmit={handleClickSubmit}
          onCancel={() => {}}
        />
      </div>
    </div>
  );
};
