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
 */
interface ProjectVotingProps {
  /**
   * The voting details for the project.
   */
  readonly votation: {
    /**
     * The date by which the voting must be completed.
     */
    readonly limitDate: Date;
    /**
     * An array of votes, where the first element represents "yes" votes and the second represents "no" votes.
     */
    readonly count: number[];
  };
  /**
   * The user details related to voting.
   */
  readonly user: {
    /**
     * The user's vote.
     */
    readonly vote?: Vote;
  };
  /**
   * The loading state of the user's vote.
   */
  readonly isLoading?: Vote;
  /**
   * The callback function that is called when a vote is clicked.
   */
  readonly onClick?: (vote: Vote) => void;
}

/**
 * ProjectVoting component renders the voting section for a project.
 *
 * @param {ProjectVotingProps} props - The props for the component.
 * @returns {JSX.Element} The JSX code for the ProjectVoting component.
 */
export const ProjectVoting: React.FC<ProjectVotingProps> = ({ votation, user, isLoading, onClick }) => {
  /**
   * A record that maps the user's vote to corresponding titles and descriptions.
   *
   * @type {Record<Vote, { title: string; color?: string; description: string }>}
   */
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

  /**
   * The default vote message displayed when the user has not voted yet.
   *
   * @type {{ title: string; description: string }}
   */
  const defaultVote = {
    title: "This project is in the voting process",
    description: `You have until ${format(votation.limitDate, "MMMM do, yyyy 'at' h:mm a")} to vote on this project`,
  };

  /**
   * The current vote message based on the user's vote or the default message.
   *
   * @type {{ title: string; description: string }}
   */
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
              color={"secondary"}
              onClick={() => onClick?.("yes")}
              isLoading={isLoading === "yes"}
              disabled={!!isLoading}
              iconLeft={<RiEmotionHappyFill size={24} />}
            />
            <Button
              caption="No"
              color={"red"}
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
