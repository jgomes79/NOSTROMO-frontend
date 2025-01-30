import { RiArrowDownLine } from "react-icons/ri";

import { useProjectsByWallet } from "@/project/hooks/useProjectsByWallet";
import { ProjectStates } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { Tabs } from "@/shared/components/Tabs";
import { useUserByWallet } from "@/user/hooks/useUserByWallet";
import { User, UserTypes } from "@/user/user.types";

import styles from "./ProjectsListByWallet.module.scss";
import { ProjectList } from "../ProjectList";

/**
 * Interface defining the props for the ProjectsListByWallet component
 *
 * @interface ProjectsListByWalletProps
 * @property {User["wallet"]} walletAddress - The Ethereum wallet address used to filter projects
 * @property {number} [limit=4] - Optional maximum number of projects to display per page
 */
interface ProjectsListByWalletProps {
  readonly walletAddress: User["wallet"];
  readonly limit?: number;
}

/**
 * Displays a filterable list of projects associated with a specific wallet address.
 * Projects can be filtered by their current state (Active, Upcoming, or Closed).
 *
 * @component ProjectsListByWallet
 * @param {ProjectsListByWalletProps} props - Component props
 * @returns {JSX.Element} A tabbed interface showing filtered projects with pagination
 */
export const ProjectsListByWallet: React.FC<ProjectsListByWalletProps> = ({ walletAddress, limit = 4 }) => {
  const { data: user } = useUserByWallet(walletAddress);
  const {
    page,
    isLoading: isLoadingProjects,
    projects,
    total,
    state,
    fetchProjectsByWallet,
  } = useProjectsByWallet(walletAddress, {
    limit,
  });

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

  return (
    <div className={styles.tabs}>
      <Tabs<ProjectStates>
        color={"yellow"}
        activeId={state}
        size={"medium"}
        tabs={projectStates}
        onRender={<ProjectList page={page} isLoading={isLoadingProjects} projects={projects} total={total} />}
        onChange={(state) => fetchProjectsByWallet(0, state)}
      />

      {total > limit && (
        <div className={styles.actions}>
          <Button
            caption="Show more"
            iconRight={<RiArrowDownLine />}
            onClick={() => fetchProjectsByWallet(page + 1, state)}
          />
        </div>
      )}
    </div>
  );
};
