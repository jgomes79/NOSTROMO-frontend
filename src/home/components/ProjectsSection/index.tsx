import { useEffect, useMemo } from "react";

import { RiArrowDownLine } from "react-icons/ri";

import { ProjectCard } from "@/project/components/ProjectCard";
import { useProjectsController } from "@/project/hooks/useProjectsController";
import { ProjectStates } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { Loader } from "@/shared/components/Loader";
import { Tabs } from "@/shared/components/Tabs";

import styles from "./ProjectsSection.module.scss";

export const ProjectsSection: React.FC = () => {
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
    if (isLoading && page === 1)
      return (
        <div className={styles.centered}>
          <Loader size={52} className={styles.loader} />
        </div>
      );

    if (!isLoading && projects.length === 0) {
      return (
        <EmptyState
          title="No projects found"
          description="Be the first to start a new project and make a difference!"
        />
      );
    }

    if (!isLoading && projects.length > 0) {
      return (
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
      );
    }
  }, [isLoading, page, projects]);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Tabs<ProjectStates>
          tabs={[
            {
              id: ProjectStates.UPCOMING,
              label: "Upcoming",
            },
            {
              id: ProjectStates.FUNDING_PHASE_1,
              label: "Active",
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
  );
};
