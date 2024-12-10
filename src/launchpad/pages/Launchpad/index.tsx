import React from "react";

import classNames from "clsx";

import { ProjectOverview } from "@/project/components/ProjectOverview";
import { useProjectsController } from "@/project/hooks/useProjectsController";

import styles from "./Launchpad.module.scss";
import { HowToBoyIdoSection } from "../../components/HowToBoyIdoSection";

export const Launchpad: React.FC = () => {
  const { projects } = useProjectsController();

  const project = projects?.[0];

  if (!project) {
    return <div>No project found</div>;
  }

  return (
    <div className={styles.layout}>
      <section className={classNames(styles.section, styles.green)}>
        <div className={styles.container}>
          <HowToBoyIdoSection />

          <ProjectOverview
            name={project.name}
            description={project.description}
            photoUrl={project.photoUrl}
            bannerUrl={project.bannerUrl}
            fundraisingGoal={project.amountToRaise}
            tokenPrice={project.tokenPrice}
            currency={project.currency.name}
            date={project.startDate}
          />
        </div>
      </section>
    </div>
  );
};
