import classNames from "clsx";
import { format } from "date-fns/format";
import {
  RiChatCheckFill,
  RiChatDeleteFill,
  RiChatPollFill,
  RiEmotionHappyFill,
  RiEmotionNormalFill,
} from "react-icons/ri";

import { formatNumber } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { GraphBar } from "@/shared/components/GraphBar";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectVoting.module.scss";

export type Vote = "yes" | "no";

/**
 * Props for the ProjectVoting component.
 * @property {Object} vote - The voting details for the project.
 * @property {Date} vote.limitDate - The date by which the voting must be completed.
 * @property {number[]} vote.count - An array of votes, where the first element represents "yes" votes and the second represents "no" votes.
 * @property {Object} user - The user details related to voting.
 * @property {Vote} [user.vote] - The user's vote.
 * @property {Vote} [isLoading] - The loading state of the user's vote.
 * @property {(vote: Vote) => void} [onClick] - The callback function that is called when a vote is clicked.
 */
interface ProjectVotingProps {
  readonly config: {
    readonly limitDate: Date;
    readonly count: number[];
  };
  readonly myVote?: Vote;
  readonly hasOwnership: boolean;
  readonly isLoading?: boolean;
  readonly onClick?: (vote: Vote) => void;
}

/**
 * ProjectVoting component renders the voting section for a project.
 *
 * @param {ProjectVotingProps} props - The props for the component.
 * @returns {JSX.Element} The JSX code for the ProjectVoting component.
 */
export const ProjectVoting: React.FC<ProjectVotingProps> = ({ config, myVote, hasOwnership, isLoading, onClick }) => {
  const isPastLimitDate = true; //isPast(config.limitDate);
  const isYes = true; // config.count[0] > config.count[1];

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
    description: `You have until ${format(config.limitDate, "MMMM do, yyyy 'at' h:mm a")} to vote on this project`,
  };

  const currentVote = myVote ? literals[myVote] : defaultVote;

  /**
   * Renders the content of the voting section.
   *
   * @returns {JSX.Element} The JSX code for the voting section.
   */
  const renderContent = () => {
    if (isPastLimitDate) {
      if (hasOwnership) {
        return (
          <div className={classNames(styles.field, styles.welcome)}>
            <RiChatCheckFill size={48} className={styles.green} />
            <div className={styles.line}>
              <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
                El proyecto ha sido {isYes ? "aprobado" : "rechazado"} por la comunidad.
              </Typography>
              <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.lightgreen}>
                Pronto se habilitaran las opciones de registro e inversión.
              </Typography>
            </div>
            <div className={classNames(styles.actions, styles.center)}>
              <div>
                <Button
                  caption="Habilitar registro"
                  size={"small"}
                  variant={"solid"}
                  color={"primary"}
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={classNames(styles.field, styles.welcome)}>
          {isYes ? (
            <RiChatCheckFill size={48} className={styles.green} />
          ) : (
            <RiChatDeleteFill size={48} className={styles.red} />
          )}
          <div className={styles.line}>
            <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
              El proyecto ha sido {isYes ? "aprobado" : "rechazado"} por la comunidad.
            </Typography>

            {isYes && (
              <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.lightgreen}>
                Pronto se habilitaran las opciones de registro e inversión.
              </Typography>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
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
          {!currentVote && (
            <div className={styles.actions}>
              <Button
                caption="Yes"
                color={"primary"}
                onClick={() => onClick?.("yes")}
                disabled={!!isLoading}
                iconLeft={<RiEmotionHappyFill size={24} />}
              />
              <Button
                caption="No"
                color={"error"}
                onClick={() => onClick?.("no")}
                disabled={!!isLoading}
                iconLeft={<RiEmotionNormalFill size={24} />}
              />
            </div>
          )}
        </div>
        <Separator />
      </>
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <Fieldset title={"Voting Phase"} variant={"white"} className={classNames(styles.section)}>
      {renderContent()}

      <div className={classNames(styles.inline, styles.data)}>
        <DataLabel
          label={"Total Votes"}
          value={formatNumber(
            config.count.reduce((acc, vote) => acc + vote, 0),
            0,
          )}
        />
        <Countdown date={config.limitDate}>
          {(timeLeft) => (
            <DataLabel
              label={"Time left"}
              value={
                isPastLimitDate
                  ? "Finished"
                  : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`
              }
            />
          )}
        </Countdown>
      </div>

      <GraphBar
        colors={["green", "red"]}
        disabled={[isPastLimitDate && !isYes, isPastLimitDate && isYes]}
        data={config.count}
      />
    </Fieldset>
  );
};
