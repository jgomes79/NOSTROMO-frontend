import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import classNames from "clsx";
import { RiSendPlaneLine } from "react-icons/ri";

import { homeProjectTabs } from "@/home/home.constants";
import { ProjectsListByState } from "@/project/components/ProjectsListByState";
import { Banner } from "@/shared/components/Banner";
import { SectionIndicator } from "@/shared/components/SectionIndicator";
import { useAppTitle } from "@/shared/hooks/useAppTitle";

import styles from "./HomePage.module.scss";
import { HowToJoinSection } from "../../components/HowToJoinSection";
import { MainSection } from "../../components/MainSection";

/**
 * HomePage component renders the main homepage layout.
 * It includes sections for the main introduction, how to join, projects, and a banner.
 *
 * @component
 * @example
 * ```tsx
 * <HomePage />
 * ```
 * @returns {JSX.Element} The rendered HomePage component.
 */
export const HomePage: React.FC = () => {
  /** Array of refs for each section in the homepage */
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  /** State to track the currently visible section */
  const [currentSection, setCurrentSection] = useState(0);
  /** Navigation hook for routing */
  const navigate = useNavigate();

  /** Set the page title */
  useAppTitle("QUBICANS, WELCOME ABOARD");

  /**
   * Scrolls smoothly to the section referenced by the given ref.
   *
   * @param {React.RefObject<HTMLElement>} sectionRef - A React ref object pointing to the section to scroll to.
   * @returns {void}
   */
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>): void => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /**
   * Handles the click event on a step in the Stepper component.
   * It scrolls smoothly to the corresponding section.
   *
   * @param {number} index - The index of the step that was clicked.
   * @returns {void}
   */
  const handleClickStep = (index: number): void => {
    const section = sectionRefs.current[index];
    if (section) {
      scrollToSection({ current: section });
    }
  };

  useEffect(() => {
    /**
     * Handles the scroll event to determine the current section in view.
     * It updates the current section index based on the section that is in the middle of the viewport.
     *
     * @returns {void}
     */
    const handleScroll = (): void => {
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
        <div className={classNames(styles.container, styles.withHeight)}>
          <ProjectsListByState tabs={homeProjectTabs} initialState={homeProjectTabs[0].id} />
        </div>
      </section>

      {/* Banner Section */}
      <section ref={(el) => (sectionRefs.current[3] = el)} className={styles.section}>
        <div className={styles.container}>
          <Banner
            title="Ready to launch your project in Nostromo?"
            description="Apply today to become part of Qubic!"
            button={{
              caption: "Apply Now!",
              icon: <RiSendPlaneLine />,
              onClick: () => {
                navigate("/projects/new");
              },
            }}
            imageUrl="https://images.unsplash.com/photo-1526392269816-39d8ed656494?q=80&w=2914&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
