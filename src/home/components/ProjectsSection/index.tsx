import { useMemo } from "react";

import { RiArrowDownLine } from "react-icons/ri";

import { ProjectCard } from "@/project/components/ProjectCard";
import { ProjectStates } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { Tabs } from "@/shared/components/Tabs";

import styles from "./ProjectsSection.module.scss";

export const ProjectsSection: React.FC = () => {
  const projects = [
    {
      title: "Project Alpha",
      description: "A revolutionary blockchain project focused on DeFi solutions",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Alpha",
      bannerUrl:
        "https://plus.unsplash.com/premium_photo-1683120972279-87efe2ba252f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpcHxlbnwwfHwwfHx8MA%3D%3D",
      fundraisingGoal: 100000,
      tokenPrice: 1,
      currency: "USDT",
      date: new Date("2025-06-01"),
    },
    {
      title: "Project Beta",
      description: "Next generation NFT marketplace platform",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Beta",
      bannerUrl:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 250000,
      tokenPrice: 2,
      currency: "USDT",
      date: new Date("2025-07-15"),
    },
    {
      title: "Project Gamma",
      description: "Decentralized social media platform",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Gamma",
      bannerUrl:
        "https://images.unsplash.com/photo-1515606378517-3451a4fa2e12?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 500000,
      tokenPrice: 3,
      currency: "USDT",
      date: new Date("2025-08-30"),
    },
    {
      title: "Project Delta",
      description: "AI-driven analytics platform for blockchain data",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Delta",
      bannerUrl:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 150000,
      tokenPrice: 4,
      currency: "USDT",
      date: new Date("2025-09-10"),
    },
    {
      title: "Project Epsilon",
      description: "Blockchain-based supply chain management system",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Epsilon",
      bannerUrl:
        "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 300000,
      tokenPrice: 5,
      currency: "USDT",
      date: new Date("2025-10-05"),
    },
    {
      title: "Project Zeta",
      description: "Decentralized finance platform for microloans",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Zeta",
      bannerUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 200000,
      tokenPrice: 6,
      currency: "USDT",
      date: new Date("2025-11-20"),
    },
    {
      title: "Project Eta",
      description: "Blockchain-based voting system for secure elections",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Eta",
      bannerUrl:
        "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 400000,
      tokenPrice: 7,
      currency: "USDT",
      date: new Date("2025-12-15"),
    },
    {
      title: "Project Theta",
      description: "Smart contract platform for automated legal agreements",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Theta",
      bannerUrl:
        "https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 350000,
      tokenPrice: 8,
      currency: "USDT",
      date: new Date("2026-01-10"),
    },
    {
      title: "Project Iota",
      description: "Blockchain-based identity verification system",
      photoUrl: "https://dummyimage.com/200x200/fff/000&text=Iota",
      bannerUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fundraisingGoal: 450000,
      tokenPrice: 9,
      currency: "USDT",
      date: new Date("2026-02-05"),
    },
  ];

  /**
   * Memoized function to render the tab container with project cards.
   *
   * @returns {JSX.Element} A div containing a list of ProjectCard components.
   */
  const renderTabContainer = useMemo(
    () => () => (
      <div className={styles.cards}>
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    ),
    [projects],
  );

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <Tabs<ProjectStates>
          tabs={[
            {
              id: ProjectStates.UPCOMING,
              label: "Upcoming",
            },
            {
              id: ProjectStates.ACTIVE,
              label: "Active",
            },
            {
              id: ProjectStates.FUNDED,
              label: "Closed",
            },
          ]}
          onRender={renderTabContainer}
        />

        <div className={styles.actions}>
          <Button caption="Show more" iconRight={<RiArrowDownLine />} />
        </div>
      </div>
    </div>
  );
};
