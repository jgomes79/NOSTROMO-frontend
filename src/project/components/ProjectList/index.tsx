import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/Skeleton";

import styles from "./ProjectList.module.scss";
import { Project } from "../../project.types";
import { ProjectCard } from "../ProjectCard";

/**
 * Props interface for the ProjectList component
 * @interface ProjectListProps
 * @property {number} page - The current page number.
 * @property {boolean} isLoading - Indicates if the component is in a loading state.
 * @property {Project[]} projects - An array of projects to display.
 * @property {number} total - The total number of projects available.
 */
interface ProjectListProps {
  /** The current page number. */
  readonly page: number;
  /** Indicates if the component is in a loading state. */
  readonly isLoading: boolean;
  /** An array of projects to display. */
  readonly projects: Project[];
  /** The total number of projects available. */
  readonly total: number;
}

/**
 * ProjectList Component
 *
 * Renders a grid of project cards with loading states and empty state handling.
 * Uses a skeleton loader for initial loading and displays an empty state message
 * when no projects are available.
 *
 * @param {ProjectListProps} props - Component props
 * @param {number} props.page - Current page number
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Project[]} props.projects - Array of projects to display
 * @returns {JSX.Element} Rendered component
 */
export const ProjectList: React.FC<ProjectListProps> = ({ isLoading, page, projects }) => {
  console.log({ isLoading });

  /**
   * Renders the empty state component when no projects are available
   *
   * @returns {JSX.Element} A centered div containing the EmptyState component
   * with a title and description for the no projects found state
   */
  const renderEmptyState = () => (
    <div className={styles.centered}>
      <EmptyState title="No projects found" description="" />
    </div>
  );

  /**
   * Renders a grid of ProjectCard components based on the projects array
   *
   * Maps through the projects array and creates individual ProjectCard components
   * with project-specific data like banner URL, currency, dates, etc.
   *
   * @returns {JSX.Element} A div containing the mapped ProjectCard components
   */
  const renderProjectCards = () => (
    <div className={styles.cards}>
      {projects.map((project, index) => (
        <ProjectCard
          key={`project-${project.slug}-${index}`}
          bannerUrl={project.bannerUrl}
          currency={project.currency.name}
          date={project.startDate}
          description={project.description}
          fundraisingGoal={project.amountToRaise}
          photoUrl={project.photoUrl}
          slug={project.slug}
          title={project.name}
          tokenPrice={project.tokenPrice}
          state={project.state}
        />
      ))}
    </div>
  );

  if (!isLoading && projects.length === 0) {
    return renderEmptyState();
  }

  return (
    <Skeleton gap={42} count={3} height={480} orientation="horizontal" width="full" isLoading={isLoading && page === 0}>
      {renderProjectCards()}
    </Skeleton>
  );
};
