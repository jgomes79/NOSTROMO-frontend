import React, { useEffect, useState, useRef } from "react";

import classNames from "clsx";
import { RiSendPlaneLine } from "react-icons/ri";

import { ProjectList } from "@/project/components/ProjectList";
import { Banner } from "@/shared/components/Banner";
import { SectionIndicator } from "@/shared/components/SectionIndicator";

import styles from "./HomePage.module.scss";
import { HowToJoinSection } from "../../components/HowToJoinSection";
import { MainSection } from "../../components/MainSection";

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

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.layout}>
      {/* Starship Section */}
      <section ref={(el) => (sectionRefs.current[0] = el)} className={styles.section}>
        <MainSection onClickShowProjects={() => handleClickStep(2)} />
      </section>

      {/* How to Join Section */}
      <section ref={(el) => (sectionRefs.current[1] = el)} className={classNames(styles.section, styles.green)}>
        <HowToJoinSection />
      </section>

      {/* Projects Section */}
      <section ref={(el) => (sectionRefs.current[2] = el)} className={styles.section}>
        <div className={styles.container}>
          <ProjectList />

          <Banner
            title="Ready to launch your project on Qubic?"
            description="Apply today and make it happen!"
            button={{ caption: "Apply Now!", icon: <RiSendPlaneLine /> }}
            imageUrl="https://img-new.cgtrader.com/items/3680126/efe442e104/large/sci-fi-material-unreal-engine-4-3d-model-low-poly-uasset-spp-sbs-tbscene.jpg"
          />
        </div>
      </section>

      {/* Stepper */}
      <div className={styles.stepper}>
        <SectionIndicator
          step={currentSection}
          steps={Array.from({ length: sectionRefs.current.length })}
          onClick={handleClickStep}
          orientation="vertical"
        />
      </div>
    </div>
  );
};
