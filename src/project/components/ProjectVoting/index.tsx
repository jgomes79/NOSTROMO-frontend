import classNames from "clsx";
import { format } from "date-fns/format";
import { RiChatPollFill, RiEmotionHappyFill, RiEmotionNormalFill } from "react-icons/ri";

import { formatNumber } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { GraphBar } from "@/shared/components/GraphBar";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectVoting.module.scss";

type Vote = "yes" | "no";

/**
 * Props for the ProjectVoting component.
 * @property {Object} votation - The voting details for the project.
 * @property {Date} votation.limitDate - The date by which the voting must be completed.
 * @property {number[]} votation.count - An array of votes, where the first element represents "yes" votes and the second represents "no" votes.
 * @property {Object} user - The user details related to voting.
 * @property {Vote} [user.vote] - The user's vote.
 * @property {Vote} [isLoading] - The loading state of the user's vote.
 * @property {(vote: Vote) => void} [onClick] - The callback function that is called when a vote is clicked.
 */
interface ProjectVotingProps {
  readonly votation: {
    readonly limitDate: Date;
    readonly count: number[];
  };
  readonly user: {
    readonly vote?: Vote;
  };
  readonly isLoading?: Vote;
  readonly onClick?: (vote: Vote) => void;
}

/**
 * ProjectVoting component renders the voting section for a project.
 *
 * @param {ProjectVotingProps} props - The props for the component.
 * @returns {JSX.Element} The JSX code for the ProjectVoting component.
 */
export const ProjectVoting: React.FC<ProjectVotingProps> = ({ votation, user, isLoading, onClick }) => {
  const literals: Record<Vote, { title: string; color?: string; description: string }> = {
    yes: {
      title: "You have voted in favor of this project",
      description: `You will be able to see the results at the end of the voting process`,
    },
    no: {
      title: "You have voted against this project",
      description: `You will be able to see the results at the end of the voting process`,
    },
  };

  const defaultVote = {
    title: "This project is in the voting process",
    description: `You have until ${format(votation.limitDate, "MMMM do, yyyy 'at' h:mm a")} to vote on this project`,
  };

  const currentVote = user.vote ? literals[user.vote] : defaultVote;

  return (
    <Fieldset title={"Voting Phase"} className={styles.section}>
      <div className={classNames(styles.field, styles.welcome)}>
        <RiChatPollFill size={48} />
        <div className={styles.line}>
          <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
            {currentVote.title}
          </Typography>
          <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.description}>
            {currentVote.description}
          </Typography>
        </div>
        {!user.vote && (
          <div className={styles.actions}>
            <Button
              caption="Yes"
              color={"primary"}
              onClick={() => onClick?.("yes")}
              isLoading={isLoading === "yes"}
              disabled={!!isLoading}
              iconLeft={<RiEmotionHappyFill size={24} />}
            />
            <Button
              caption="No"
              color={"error"}
              onClick={() => onClick?.("no")}
              isLoading={isLoading === "no"}
              disabled={!!isLoading}
              iconLeft={<RiEmotionNormalFill size={24} />}
            />
          </div>
        )}
      </div>
      <Separator />

      <div className={classNames(styles.inline, styles.data)}>
        <DataLabel
          label={"Total Votes"}
          value={formatNumber(
            votation.count.reduce((acc, vote) => acc + vote, 0),
            0,
          )}
        />
        <Countdown date={votation.limitDate}>
          {(timeLeft) => (
            <DataLabel
              label={"Time left"}
              value={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
            />
          )}
        </Countdown>
      </div>

      <div className={styles.inline}>
        <GraphBar colors={["green", "red"]} data={votation.count} />
      </div>
    </Fieldset>
  );
};
