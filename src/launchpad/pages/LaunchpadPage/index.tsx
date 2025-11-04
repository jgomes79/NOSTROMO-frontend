import React, { useMemo, useRef, useState } from "react";

import classNames from "clsx";
import { RiArrowLeftLine, RiArrowRightLine, RiArrowUpLine, RiCloseCircleLine, RiStarLine } from "react-icons/ri";

import { ProjectOverview } from "@/project/components/ProjectOverview";
import { ProjectsListByState } from "@/project/components/ProjectsListByState";
import { useProjectsVip } from "@/project/hooks/useProjectsVip";
import { IconButton } from "@/shared/components/IconButton";
import { Loader } from "@/shared/components/Loader";
import { SectionIndicator } from "@/shared/components/SectionIndicator";
import { Slider, SliderElement } from "@/shared/components/Slider";
import { useAppTitle } from "@/shared/hooks/useAppTitle";

import { ProjectStates } from "@/project/project.types";
import { EmptyState } from "@/shared/components/EmptyState";
import { Separator } from "@/shared/components/Separator";
import { Tabs } from "@/shared/components/Tabs";
import { HowToBoyIdoSection } from "../../components/HowToBoyIdoSection";
import styles from "./LaunchpadPage.module.scss";

export const LaunchpadPage: React.FC = () => {
  const slider = useRef<SliderElement>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { projects, isLoading } = useProjectsVip();
  const [currentState, setCurrentState] = useState<ProjectStates>(ProjectStates.FUNDING_PHASE_1);

  useAppTitle("Launchpad");

  const projectTabs = useMemo(() => {
    return [
      {
        id: ProjectStates.UPCOMING,
        label: "Upcoming",
        iconLeft: <RiArrowUpLine />,
      },
      {
        id: ProjectStates.CLOSED,
        label: "Closed",
        iconLeft: <RiCloseCircleLine />,
      },
    ];
  }, [currentState]);

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

  /**
   *
   * @returns
   */
  const renderOverview = () => {
    if (isLoading) {
      return (
        <div className={styles.loader}>
          <Loader size={52} />
        </div>
      );
    }

    return (
      <>
        <div className={styles.sliderFrame}>
          {projects.length > 0 ? (
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
          ) : (
            <div className={styles.loader}>
              <EmptyState
                icon={<RiStarLine />}
                title="No featured projects yet"
                description="When there are featured projects, you will be able to see them here"
              />
            </div>
          )}
        </div>
        {projects.length > 0 && renderSliderControls}
      </>
    );
  };

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
        <div className={styles.container}>
          <div className={styles.slider}>{renderOverview()}</div>
        </div>
      </section>

      <Separator />
      <section className={styles.section}>
        <div className={styles.container}>
          <Tabs<ProjectStates>
            activeId={currentState}
            size={"large"}
            tabs={projectTabs}
            onChange={(tabId) => setCurrentState(tabId)}
          />

          <ProjectsListByState state={currentState} />
        </div>
      </section>
    </div>
  );
};
