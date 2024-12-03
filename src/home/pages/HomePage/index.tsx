import React from "react";

import { MainSection } from "@/home/components/MainSection";
import { ProjectsSection } from "@/home/components/ProjectsSection";

import styles from "./HomePage.module.scss";

export const HomePage: React.FC = () => {
  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <MainSection />
      </section>
      <section className={styles.section}>
        <ProjectsSection />
      </section>
      <section className={styles.section}>Section 3</section>
      <section className={styles.section}>Section 4</section>
    </div>
  );
};
