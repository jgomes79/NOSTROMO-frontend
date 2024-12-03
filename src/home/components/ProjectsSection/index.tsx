import { ProjectCard } from "@/project/components/ProjectCard";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectsSection.module.scss";

export const ProjectsSection: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant={"heading"} size={"large"}>
            Active Projects
          </Typography>
        </div>
        <div className={styles.cards}>
          <ProjectCard
            title="Project Alpha"
            description="A revolutionary blockchain project focused on DeFi solutions"
            photoUrl="https://dummyimage.com/200x200/fff/000&text=Alpha"
            bannerUrl="https://plus.unsplash.com/premium_photo-1683120972279-87efe2ba252f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpcHxlbnwwfHwwfHx8MA%3D%3D"
            amount={100000}
            currency="USDT"
            date={new Date("2025-06-01")}
          />
          <ProjectCard
            title="Project Beta"
            description="Next generation NFT marketplace platform"
            photoUrl="https://dummyimage.com/200x200/fff/000&text=Beta"
            bannerUrl="https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            amount={250000}
            currency="USDT"
            date={new Date("2025-07-15")}
          />
          <ProjectCard
            title="Project Gamma"
            description="Decentralized social media platform"
            photoUrl="https://dummyimage.com/200x200/fff/000&text=Gamma"
            bannerUrl="https://images.unsplash.com/photo-1515606378517-3451a4fa2e12?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            amount={500000}
            currency="USDT"
            date={new Date("2025-08-30")}
          />
        </div>
      </div>
    </div>
  );
};
