import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import { RiAliensFill, RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { getRoute } from "@/lib/router";
import { useProject } from "@/project/hooks/useProject";
import { usePublishProject } from "@/project/hooks/usePublishProject";
import { useUpsertProject } from "@/project/hooks/useUpsertProject";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { USER_ROUTES } from "@/user/user.constants";

import styles from "./CreateOrEditProjectPage.module.scss";
import { ProjectForm } from "../../forms/ProjectForm";
import { ProjectFormValues } from "../../forms/ProjectForm";
import { Project } from "../../project.types";

/**
 * Type representing the parameters for the CreateOrEditProjectPage component.
 *
 * @property {string} [projectId] - The optional project ID parameter.
 */
type CreateOrEditProjectPageParams = {
  slug?: Project["slug"];
};

/**
 * CreateOrEditProjectPage component.
 *
 * This component renders the new project page, which includes a form for creating a new project.
 *
 * @returns {JSX.Element} The rendered new project page component.
 */
export const CreateOrEditProjectPage: React.FC = () => {
  const navigate = useNavigate();

  const upsertProject = useUpsertProject(),
    publishProject = usePublishProject();

  const params = useParams<CreateOrEditProjectPageParams>();

  const { data: wallet, isLoading: isLoadingWallet } = useWalletClient(),
    project = useProject(params.slug);

  /**
   * Handles the form submission for creating, updating, or publishing a project.
   *
   * @param {boolean} isPublishing - Indicates if the project should be published.
   * @param {ProjectFormValues} values - The form values from the project form.
   * @returns {Promise<void>} A promise that resolves when the mutation is complete.
   */
  const handleClickSubmit = useCallback(
    async (isPublishing: boolean, values: ProjectFormValues) => {
      if (isPublishing && project.data) {
        await publishProject.mutateAsync(project.data.id);
      } else {
        await upsertProject.mutateAsync(values);
      }
      await project.refetch();

      if (isPublishing || values.id === undefined) navigate(getRoute(USER_ROUTES.MY_PROJECTS));
      // TODO. else poner el scroll arriba del todo
    },
    [upsertProject, project, publishProject, navigate],
  );

  /**
   * Renders a loader if the project data is still loading.
   *
   * @returns {JSX.Element} The loader component.
   */
  if (project.isLoading || isLoadingWallet) {
    return <Loader variant={"full"} size={52} />;
  }

  /**
   * Renders an error page if the wallet is not connected or the account is unavailable.
   *
   * @returns {JSX.Element} The error page component prompting the user to connect their wallet.
   */
  if (!wallet || !wallet?.account) {
    return (
      <ErrorPage
        code={<RiAliensFill className={styles.alien} />}
        title={"No Signal"}
        description={"To create a project, you need to be connected to a wallet."}
        actions={[
          <WalletButton.Custom wallet="metamask" key={"connect"}>
            {({ connected, connect }) => (
              <>
                {!connected && (
                  <Button
                    variant={"solid"}
                    color={"secondary"}
                    size={"small"}
                    caption={"Connect Wallet"}
                    onClick={connect}
                    iconLeft={<RiWallet2Line />}
                  />
                )}
              </>
            )}
          </WalletButton.Custom>,
        ]}
      />
    );
  }

  /**
   * Renders an error page if the project data is not found or unavailable.
   *
   * @returns {JSX.Element} The error page component indicating the project is not found.
   */
  if (!project.isLoading && params.slug && project.error) {
    return (
      <ErrorPage
        code={"404"}
        title={"Project Not Found"}
        description={"We're sorry, but the project you're looking for is either unavailable or doesn't exist."}
        actions={[<Button key={"home"} caption={"Return Home"} />]}
      />
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.gradient} />
      </div>
      <div className={styles.form}>
        <ProjectForm
          isLoading={upsertProject.isPending || publishProject.isPending || project.isRefetching}
          defaultValues={project.data || undefined}
          onSubmit={handleClickSubmit}
        />
      </div>
    </div>
  );
};
