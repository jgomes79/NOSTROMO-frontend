import React, { useMemo, useRef, useState } from "react";

import classNames from "clsx";
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri";

import { ProjectList } from "@/project/components/ProjectList";
import { ProjectOverview } from "@/project/components/ProjectOverview";
import { useProjectsController } from "@/project/hooks/useProjectsController";
import { IconButton } from "@/shared/components/IconButton";
import { Loader } from "@/shared/components/Loader";
import { SectionIndicator } from "@/shared/components/SectionIndicator";
import { Slider, SliderElement } from "@/shared/components/Slider";
import { useAppTitle } from "@/shared/hooks/useAppTitle";

import styles from "./Launchpad.module.scss";
import { HowToBoyIdoSection } from "../../components/HowToBoyIdoSection";

export const Launchpad: React.FC = () => {
  const slider = useRef<SliderElement>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { projects, isLoading } = useProjectsController();

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
          icon={<RiArrowLeftFill />}
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
          icon={<RiArrowRightFill />}
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
          <ProjectList />
        </div>
      </section>
    </div>
  );
};
