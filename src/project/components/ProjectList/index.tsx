import { useEffect, useMemo } from "react";

import { RiArrowDownLine } from "react-icons/ri";

import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/Skeleton";
import { Tabs } from "@/shared/components/Tabs";

import styles from "./ProjectList.module.scss";
import { useProjectsController } from "../../hooks/useProjectsController";
import { ProjectStates } from "../../project.types";
import { ProjectCard } from "../ProjectCard";

/**
 * A component that renders a list of projects with tabs for different project states.
 *
 * @returns {JSX.Element} The rendered ProjectList component.
 */
export const ProjectList: React.FC = () => {
  const { page, isLoading, projects, total, state, fetchProjects } = useProjectsController();

  useEffect(() => {
    fetchProjects(1, state);
  }, [state]);

  /**
   * Memoized function to render the list of projects.
   *
   * @returns {JSX.Element | undefined} - A JSX element containing the list of projects or a loading indicator.
   */
  const renderProjects = useMemo(() => {
    if (!isLoading && projects.length === 0) {
      return (
        <div className={styles.centered}>
          <EmptyState
            title="No projects found"
            description="Be the first to start a new project and make a difference!"
          />
        </div>
      );
    }

    return (
      <Skeleton
        count={3}
        orientation="horizontal"
        height={480}
        gap={42}
        width={"full"}
        isLoading={isLoading && page === 1}
        className={styles.inner}
      >
        <div className={styles.cards}>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              bannerUrl={project.bannerUrl}
              currency={project.currency.name}
              date={project.startDate}
              description={project.description}
              fundraisingGoal={project.amountToRaise}
              photoUrl={project.photoUrl}
              slug={project.slug}
              title={project.name}
              tokenPrice={project.tokenPrice}
            />
          ))}
        </div>
      </Skeleton>
    );
  }, [isLoading, page, projects]);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <Tabs<ProjectStates>
            tabs={[
              {
                id: ProjectStates.FUNDING_PHASE_1,
                label: "Active",
              },
              {
                id: ProjectStates.UPCOMING,
                label: "Upcoming",
              },
              {
                id: ProjectStates.CLOSED,
                label: "Closed",
              },
            ]}
            onRender={renderProjects}
            onChange={(state) => fetchProjects(1, state)}
          />

          {total > 4 && (
            <div className={styles.actions}>
              <Button
                caption="Show more"
                iconRight={<RiArrowDownLine />}
                onClick={() => fetchProjects(page + 1, state)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
