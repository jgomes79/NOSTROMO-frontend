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
    readonly startDate: Date;
    readonly limitDate: Date;
    readonly count: number[];
  };
  readonly myVote?: boolean;
  readonly hasOwnership: boolean;
  readonly isLoading?: boolean;
  readonly onClick?: (vote: boolean) => void;
}

/**
 * ProjectVoting component renders the voting section for a project.
 *
 * @param {ProjectVotingProps} props - The props for the component.
 * @returns {JSX.Element} The JSX code for the ProjectVoting component.
 */
export const ProjectVoting: React.FC<ProjectVotingProps> = ({ config, myVote, hasOwnership, isLoading, onClick }) => {
  const isAfterStartDate = config.startDate < new Date();
  const isVotingPhase = new Date() > config.startDate && new Date() < config.limitDate;
  const isYes = config.count[0] > config.count[1];

  const hasVotedLiterals = {
    title: "You have voted in this project",
    description: `You will be able to see the results at the end of the voting process`,
  };

  const defaultVote = {
    title: isAfterStartDate
      ? "This project is waiting for the voting to start"
      : "This project is in the voting process",
    description: isAfterStartDate
      ? `The voting will start at ${format(config.startDate, "MMMM do, yyyy 'at' h:mm a")}`
      : `You have until ${format(config.limitDate, "MMMM do, yyyy 'at' h:mm a")} to vote on this project`,
  };

  const currentVote = myVote ? hasVotedLiterals : defaultVote;

  /**
   * Renders the content of the voting section.
   *
   * @returns {JSX.Element} The JSX code for the voting section.
   */
  const renderContent = () => {
    if (new Date() > config.limitDate) {
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
                  onClick={() => null}
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
          {!myVote && isAfterStartDate && (
            <div className={styles.actions}>
              <Button
                caption="Yes"
                color={"primary"}
                onClick={() => onClick?.(true)}
                disabled={!!isLoading}
                iconLeft={<RiEmotionHappyFill size={24} />}
              />
              <Button
                caption="No"
                color={"error"}
                onClick={() => onClick?.(false)}
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

      {isAfterStartDate && (
        <>
          <div className={classNames(styles.inline, styles.data)}>
            <DataLabel
              label={"Total Votes"}
              value={formatNumber(
                config.count.reduce((acc, vote) => acc + vote, 0),
                0,
              )}
            />
            <Countdown date={!isVotingPhase ? config.startDate : config.limitDate}>
              {(timeLeft) => (
                <DataLabel
                  label={"Time left"}
                  value={
                    new Date() > config.limitDate
                      ? "Finished"
                      : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`
                  }
                />
              )}
            </Countdown>
          </div>

          <GraphBar
            colors={["green", "red"]}
            disabled={[new Date() > config.limitDate && !isYes, new Date() > config.limitDate && isYes]}
            data={config.count}
          />
        </>
      )}
    </Fieldset>
  );
};
