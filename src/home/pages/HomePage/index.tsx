import React from "react";

import { MainSection } from "@/home/components/MainSection";
import { ProjectsSection } from "@/home/components/ProjectsSection";

import styles from "./HomePage.module.scss";

export const HomePage: React.FC = () => {
  const projectsRef = React.useRef<HTMLElement>(null);

  /**
   * Scrolls smoothly to the section referenced by the given ref.
   *
   * @param sectionRef - A React ref object pointing to the section to scroll to.
   */
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <MainSection onClickShowProjects={() => scrollToSection(projectsRef)} />
      </section>
      <section ref={projectsRef} className={styles.section}>
        <ProjectsSection />
      </section>
      <section className={styles.section}>Section 3</section>
      <section className={styles.section}>Section 4</section>
    </div>
  );
};
