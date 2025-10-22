import React, { useMemo, useRef, useState } from "react";

import classNames from "clsx";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

import { ProjectOverview } from "@/project/components/ProjectOverview";
import { ProjectsListByState } from "@/project/components/ProjectsListByState";
import { useProjectsVip } from "@/project/hooks/useProjectsVip";
import { IconButton } from "@/shared/components/IconButton";
import { Loader } from "@/shared/components/Loader";
import { SectionIndicator } from "@/shared/components/SectionIndicator";
import { Slider, SliderElement } from "@/shared/components/Slider";
import { useAppTitle } from "@/shared/hooks/useAppTitle";

import { HowToBoyIdoSection } from "../../components/HowToBoyIdoSection";
import { launchpadProjectTabs } from "../../launchpad.constants";
import styles from "./LaunchpadPage.module.scss";

export const LaunchpadPage: React.FC = () => {
  const slider = useRef<SliderElement>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { projects, isLoading } = useProjectsVip();

  useAppTitle("Launchpad");

  /**
   * Renders the slider controls for navigating through projects.
   *
   * @returns A JSX element containing the slider controls or null if the slider is not initialized.
   */
  const renderSliderControls = useMemo(() => {
    return (
      <div className={styles.stepper}>
        <IconButton
          icon={<RiArrowLeftLine />}
          size={"small"}
          variant={"ghost"}
          onClick={() => slider.current?.previous()}
          disabled={currentIndex === 0}
        />
        <SectionIndicator
          step={currentIndex}
          steps={Array.from({ length: projects.length })}
          onClick={(index) => slider.current?.moveTo(index)}
          orientation="horizontal"
        />
        <IconButton
          icon={<RiArrowRightLine />}
          size={"small"}
          variant={"ghost"}
          onClick={() => slider.current?.next()}
          disabled={currentIndex === projects.length - 1}
        />
      </div>
    );
  }, [currentIndex, slider.current, projects.length]);

  return (
    <div className={styles.layout}>
      <section className={classNames(styles.section, styles.top)}>
        <div className={styles.diffuse} />

        {/* How to buy IDO */}
        <div className={classNames(styles.container, styles.large, styles.bottomLighting)}>
          <div className={styles.zIndexSuperior}>
            <HowToBoyIdoSection />
          </div>
        </div>

        {/* Project Overview */}
        <div className={classNames(styles.container, styles.large)}>
          <div className={styles.slider}>
            {isLoading ? (
              <div className={styles.loader}>
                <Loader size={52} />
              </div>
            ) : (
              <>
                <div className={styles.sliderFrame}>
                  <Slider
                    ref={slider}
                    delay={5000}
                    onMove={setCurrentIndex}
                    components={projects.map((project, index) => (
                      <ProjectOverview
                        key={index}
                        name={project.name}
                        slug={project.slug}
                        description={project.description}
                        photoUrl={project.photoUrl}
                        bannerUrl={project.bannerUrl}
                        fundraisingGoal={project.amountToRaise}
                        tokenPrice={project.tokenPrice}
                        currency={project.currency.name}
                        date={project.startDate}
                      />
                    ))}
                  />
                </div>
                {renderSliderControls}
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <ProjectsListByState initialState={launchpadProjectTabs[0].id} />
        </div>
      </section>
    </div>
  );
};
