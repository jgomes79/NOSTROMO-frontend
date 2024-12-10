import { Link } from "react-router-dom";

import { formatPrice } from "@/lib/number";
import { trimString } from "@/lib/string";
import { Countdown } from "@/shared/components/Countdown";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  photoUrl: string;
  bannerUrl: string;
  fundraisingGoal: number;
  tokenPrice: number;
  currency: string;
  date: Date;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  description,
  photoUrl,
  bannerUrl,
  fundraisingGoal,
  tokenPrice,
  currency,
  date,
}) => {
  const renderField = (label: string, value: string) => (
    <div className={styles.row}>
      <Typography variant={"body"} size={"small"}>
        {label}
      </Typography>
      <Typography className={styles.value} variant={"body"} size={"small"}>
        {value}
      </Typography>
    </div>
  );
  return (
    <Link className={styles.layout} to={`/projects/${slug}`}>
      <div className={styles.body}>
        {/* Banner */}
        <img src={bannerUrl} className={styles.banner} width={"100%"} height={160} alt={"Project Banner"} />

        {/* Date */}
        <div className={styles.date}>
          <Typography variant={"body"} textTransform={"uppercase"} size={"xsmall"}>
            Registration ends in
          </Typography>
          <Typography variant={"body"} size={"xsmall"}>
            <Countdown date={date}>
              {(timeLeft) => (
                <>
                  {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
                </>
              )}
            </Countdown>
          </Typography>
        </div>

        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <img src={photoUrl} className={styles.image} width={"100%"} height={94} alt={"Project Photo"} />
            <Typography as={"h3"} variant="heading" size="small">
              {title}
            </Typography>
          </div>

          {/* Description */}
          <Typography variant={"body"} className={styles.description} size={"medium"} textAlign={"center"}>
            {trimString(description, 90)}
          </Typography>

          {/* Fields */}
          <div className={styles.field}>
            {renderField("Fundraising Goal", formatPrice(fundraisingGoal, currency))}
            {renderField("Token Price", formatPrice(tokenPrice, currency))}
          </div>
        </div>
        <div className={styles.footer}>
          <Typography variant={"body"} size={"xsmall"} textTransform={"uppercase"}>
            Review and Vote
          </Typography>
        </div>
      </div>
    </Link>
  );
};
