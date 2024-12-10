import React, { useRef, useState } from "react";

import classNames from "clsx";
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri";

import { ProjectList } from "@/project/components/ProjectList";
import { ProjectOverview } from "@/project/components/ProjectOverview";
import { useProjectsController } from "@/project/hooks/useProjectsController";
import { IconButton } from "@/shared/components/IconButton";
import { SectionIndicator } from "@/shared/components/SectionIndicator";
import { Slider, SliderElement } from "@/shared/components/Slider";

import styles from "./Launchpad.module.scss";
import { HowToBoyIdoSection } from "../../components/HowToBoyIdoSection";

export const Launchpad: React.FC = () => {
  const slider = useRef<SliderElement>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { projects } = useProjectsController();

  return (
    <div className={styles.layout}>
      <section className={classNames(styles.section, styles.green)}>
        <div className={styles.container}>
          {/* How to buy IDO */}
          <HowToBoyIdoSection />

          {/* Project Overview */}
          <div className={styles.slider}>
            <Slider
              ref={slider}
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
            {slider.current && (
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
