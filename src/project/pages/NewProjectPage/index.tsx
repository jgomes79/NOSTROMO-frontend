import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useWalletClient } from "wagmi";

import { Loader } from "@/shared/components/Loader";

import styles from "./NewProjectPage.module.scss";
import { ProjectForm } from "../../forms/ProjectForm";
import { ProjectFormValues } from "../../forms/ProjectForm";
import { useInitProject } from "../../hooks/useInitProject";
import { useNewProject } from "../../hooks/useNewProject";
import { useProjectById } from "../../hooks/useProjectById";

/**
 * Type representing the parameters for the NewProjectPage component.
 *
 * @property {string} [projectId] - The optional project ID parameter.
 */
type NewProjectPageParams = {
  projectId?: string;
};

/**
 * NewProjectPage component.
 *
 * This component renders the new project page, which includes a form for creating a new project.
 *
 * @returns {JSX.Element} The rendered new project page component.
 */
export const NewProjectPage: React.FC = () => {
  const newProjectMutation = useNewProject(),
    initProjectMutation = useInitProject();

  const params = useParams<NewProjectPageParams>();

  const { data: wallet } = useWalletClient(),
    project = useProjectById(Number(params.projectId) ?? undefined);

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

  /**
   * useEffect hook to initialize a new project if the projectId is not present and the wallet is available.
   *
   * @remarks
   * This effect runs whenever the `params.projectId` or `wallet` changes.
   * If the `projectId` is not present in the URL parameters and the wallet is connected,
   * it triggers the `initProjectMutation` to initialize a new project with the wallet's account address.
   */
  useEffect(() => {
    if (!params.projectId && wallet && wallet.account) {
      initProjectMutation.mutateAsync(wallet.account.address);
    }
  }, [params.projectId, wallet]);

  if (project.isLoading || initProjectMutation.isPending) {
    return <Loader />;
  }

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
