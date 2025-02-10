import classNames from "clsx";
import { format } from "date-fns/format";
import { RiChatPollFill, RiEmotionHappyFill, RiEmotionNormalFill } from "react-icons/ri";

import { formatNumber } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { GraphBar } from "@/shared/components/GraphBar";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectVoting.module.scss";

type Vote = "yes" | "no";

/**
 * Props for the ProjectVoting component.
 *
 * @property {number[]} [votes] - An optional array of votes, where the first element represents "yes" votes and the second represents "no" votes.
 * @property {"yes" | "no"} [myVote] - An optional property indicating the user's vote.
 * @property {Vote} [isLoading] - An optional property indicating the loading state of the user's vote.
 * @property {(vote: Vote) => void} [onClick] - An optional callback function that is called when a vote is clicked.
 * @property {Date} date - The date by which the voting must be completed.
 */
interface ProjectVotingProps {
  votes?: number[];
  myVote?: Vote;
  isLoading?: Vote;
  onClick?: (vote: Vote) => void;
  date: Date;
}

/**
 * ProjectVoting component renders the voting section for a project.
 *
 * @param {ProjectVotingProps} props - The props for the component.
 * @returns {JSX.Element} The JSX code for the ProjectVoting component.
 */
export const ProjectVoting: React.FC<ProjectVotingProps> = ({ votes = [0, 0], date, myVote, onClick, isLoading }) => {
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
    description: `You have until ${format(date, "MMMM do, yyyy 'at' h:mm a")} to vote on this project`,
  };

  const currentVote = myVote ? literals[myVote] : defaultVote;

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
        {!myVote && (
          <div className={styles.actions}>
            <Button
              caption="Yes"
              color={"secondary"}
              onClick={() => onClick?.("yes")}
              isLoading={isLoading === "yes"}
              iconLeft={<RiEmotionHappyFill size={24} />}
            />
            <Button
              caption="No"
              color={"red"}
              onClick={() => onClick?.("no")}
              isLoading={isLoading === "no"}
              iconLeft={<RiEmotionNormalFill size={24} />}
            />
          </div>
        )}
      </div>

      <div className={classNames(styles.inline, styles.data)}>
        <DataLabel
          label={"Total Votes"}
          value={formatNumber(
            votes.reduce((acc, vote) => acc + vote, 0),
            0,
          )}
        />
        <Countdown date={date}>
          {(timeLeft) => (
            <DataLabel
              label={"Time left"}
              value={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
            />
          )}
        </Countdown>
      </div>

      <div className={styles.inline}>
        <GraphBar colors={["green", "red"]} data={votes} />
      </div>
    </Fieldset>
  );
};
