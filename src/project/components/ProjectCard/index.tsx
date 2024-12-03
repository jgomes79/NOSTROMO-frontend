import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { formatPrice } from "@/lib/number";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  title: string;
  description: string;
  photoUrl: string;
  bannerUrl: string;

  amount: number;
  currency: string;
  date: Date;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  photoUrl,
  bannerUrl,
  amount,
  currency,
  date,
}) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <img src={bannerUrl} className={styles.bannerImg} width={"100%"} height={140} alt={"Project Banner"} />
          <div className={styles.header}>
            <img src={photoUrl} className={styles.image} width={"100%"} height={94} alt={"Project Photo"} />
            <Typography as={"h3"} variant="heading" size="medium">
              {title}
            </Typography>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <Typography variant={"body"} className={styles.description} size={"medium"} textAlign={"center"}>
          {description}
        </Typography>
        <div className={styles.amount}>
          <Typography variant={"body"} size={"small"}>
            Targeted Raise
          </Typography>
          <Typography variant={"body"} size={"medium"}>
            {formatPrice(amount, currency)}
          </Typography>
        </div>
      </div>
      <div className={styles.footer}>
        <Typography variant={"body"} textTransform={"uppercase"} size={"xsmall"}>
          Registration ends in
        </Typography>
        <Typography variant={"body"} size={"small"}>
          {formatDistanceToNow(date, { addSuffix: false })}
        </Typography>
      </div>
    </div>
  );
};
