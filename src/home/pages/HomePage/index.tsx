import React, { useEffect, useState, useRef } from "react";

import { MainSection } from "@/home/components/MainSection";
import { ProjectsSection } from "@/home/components/ProjectsSection";
import { Stepper } from "@/shared/components/Stepper";

import styles from "./HomePage.module.scss";

export const HomePage: React.FC = () => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  /**
   * Scrolls smoothly to the section referenced by the given ref.
   *
   * @param sectionRef - A React ref object pointing to the section to scroll to.
   */
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /**
   * Handles the click event on a step in the Stepper component.
   * It scrolls smoothly to the corresponding section.
   *
   * @param index - The index of the step that was clicked.
   */
  const handleClickStep = (index: number) => {
    const section = sectionRefs.current[index];
    if (section) {
      scrollToSection({ current: section });
    }
  };

  useEffect(() => {
    /**
     * Handles the scroll event to determine the current section in view.
     * It updates the current section index based on the section that is in the middle of the viewport.
     */
    const handleScroll = () => {
      let index = 0;

      sectionRefs.current.forEach((section, i) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            index = i;
          }
        }
      });

      setCurrentSection(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.layout}>
      {/* Starship Section */}
      <section ref={(el) => (sectionRefs.current[0] = el)} className={styles.section}>
        <MainSection onClickShowProjects={() => handleClickStep(1)} />
      </section>

      {/* Projects Section */}
      <section ref={(el) => (sectionRefs.current[1] = el)} className={styles.section}>
        <ProjectsSection />
      </section>

      {/* Stepper */}
      <div className={styles.stepper}>
        <Stepper
          step={currentSection}
          steps={Array.from({ length: sectionRefs.current.length })}
          onClick={handleClickStep}
          orientation="vertical"
        />
      </div>
    </div>
  );
};
