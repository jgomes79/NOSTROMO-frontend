import { RiArrowDownLine } from "react-icons/ri";

import { useProjectsByWallet } from "@/project/hooks/useProjectsByWallet";
import { Button } from "@/shared/components/Button";
import { User } from "@/user/user.types";

import { ProjectList } from "../ProjectList";
import styles from "./ProjectsListByWallet.module.scss";

/**
 * Interface defining the props for the ProjectsListByWallet component
 */
interface ProjectsListByWalletProps {
  /**
   * The Ethereum wallet address used to filter projects
   */
  readonly walletAddress: User["wallet"];

  /**
   * Optional maximum number of projects to display per page
   */
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
  const {
    page,
    isLoading: isLoadingProjects,
    isFetching: isFetchingProjects,
    projects,
    total,
    state,
    fetchProjectsByWallet,
  } = useProjectsByWallet(walletAddress, {
    limit,
  });

  return (
    <div className={styles.tabs}>
      <ProjectList page={page} isLoading={isLoadingProjects} projects={projects} total={total} />

      {!isLoadingProjects ||
        (projects.length > 0 && (
          <div className={styles.actions}>
            <Button
              caption="Show more"
              iconRight={<RiArrowDownLine />}
              disabled={projects.length >= total}
              isLoading={isFetchingProjects}
              onClick={() => fetchProjectsByWallet(page + 1, state)}
            />
          </div>
        ))}
    </div>
  );
};
