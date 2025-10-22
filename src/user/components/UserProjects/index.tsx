import React from "react";

import { ProjectStates } from "../../../project/project.types";
import { Tabs } from "../../../shared/components/Tabs";
import { useUserByWallet } from "../../hooks/useUserByWallet";
import { User, UserTypes } from "../../user.types";
import styles from "./UserProjects.module.scss";

import { ProjectsListByState } from "../../../project/components/ProjectsListByState";
import { ProjectsListByWallet } from "../../../project/components/ProjectsListByWallet";

/**
 * Props for the UserProjects component.
 * @typedef {Object} UserProjectsProps
 * @property {User["wallet"]} wallet - The wallet address of the user.
 */
interface UserProjectsProps {
  readonly wallet: User["wallet"];
}

/**
 * Component that displays a list of projects for a user.
 * @component UserProjects
 * @param {UserProjectsProps} props - The props for the UserProjects component.
 * @returns {JSX.Element} The UserProjects component.
 */
export const UserProjects: React.FC<UserProjectsProps> = ({ wallet }) => {
  const { data: user } = useUserByWallet(wallet);

  const adminOptions = [
    {
      id: ProjectStates.SENT_TO_REVIEW,
      label: "Pending to Review",
    },
  ];

  /**
   * Array of project states with their respective IDs and labels.
   *
   * @type {Array<{ id: ProjectStates, label: string }>}
   */
  const projectStates = [
    {
      id: ProjectStates.ALL,
      label: "My Projects",
    },
    {
      id: ProjectStates.READY_TO_VOTE,
      label: "Available to vote",
    },
    {
      id: ProjectStates.UPCOMING,
      label: "Registered",
    },
    ...(user?.type === UserTypes.ADMIN ? adminOptions : []),
  ];

  const renderProjectList = (tabId: ProjectStates) => {
    switch (tabId) {
      case ProjectStates.ALL:
        return <ProjectsListByWallet walletAddress={wallet} limit={9} />;
      case ProjectStates.READY_TO_VOTE:
        return <ProjectsListByState initialState={ProjectStates.READY_TO_VOTE} />;
      case ProjectStates.UPCOMING:
        return <ProjectsListByState initialState={ProjectStates.UPCOMING} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabs}>
      <Tabs<ProjectStates>
        color={"cyan"}
        activeId={ProjectStates.ALL}
        size={"medium"}
        tabs={projectStates}
        onRender={(tabId) => renderProjectList(tabId)}
      />
    </div>
  );
};
