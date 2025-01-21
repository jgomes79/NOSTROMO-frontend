import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import { RiAliensFill, RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { getRoute } from "@/lib/router";
import { useProject } from "@/project/hooks/useProject";
import { PROJECT_ROUTES } from "@/project/project.constants";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { ErrorPage } from "@/shared/pages/ErrorPage";

import styles from "./CreateOrEditProjectPage.module.scss";
import { ProjectForm } from "../../forms/ProjectForm";
import { ProjectFormValues } from "../../forms/ProjectForm";
import { useInitProject } from "../../hooks/useInitProject";
import { useNewProject } from "../../hooks/useNewProject";
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

  const newProjectMutation = useNewProject(),
    initProjectMutation = useInitProject();

  const params = useParams<CreateOrEditProjectPageParams>();

  const { data: wallet } = useWalletClient(),
    project = useProject(params.slug);

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
    const initializeProject = async () => {
      if (!params.slug && wallet && wallet.account) {
        const data = await initProjectMutation.mutateAsync(wallet.account.address);
        if (data && data.slug) {
          console.log("data", data);
          navigate(getRoute(PROJECT_ROUTES.EDIT_PROJECT, { slug: data.slug }));
        }
      }
    };

    initializeProject();
  }, [params.slug, wallet]);

  console.log("wallet", wallet);
  console.log("project", project);
  console.log("initProjectMutation", initProjectMutation);

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

  if (project.isLoading || initProjectMutation.isPending || !params.slug) {
    return <Loader variant={"full"} size={52} />;
  }

  if ((!project.isLoading && params.slug && project.error) || !project.data) {
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
        <ProjectForm defaultValues={project.data} onSubmit={handleClickSubmit} onCancel={() => {}} />
      </div>
    </div>
  );
};
