import classNames from "clsx";
import { format } from "date-fns/format";
import {
  RiArrowUpCircleFill,
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
  readonly isAdmin: boolean;
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
export const ProjectVoting: React.FC<ProjectVotingProps> = ({
  config,
  myVote,
  isAdmin,
  hasOwnership,
  isLoading,
  onClick,
}) => {
  const isYes = config.count[0] > config.count[1];

  const hasVotedLiterals = {
    title: "You have voted in this project",
    description: `You will be able to see the results at the end of the voting process`,
  };

  const defaultVote = {
    title:
      new Date() < config.startDate
        ? "This project is waiting for the voting to start"
        : "This project is in the voting process",
    description:
      new Date() < config.startDate
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
      if (isAdmin && isYes) {
        return (
          <div className={classNames(styles.field, styles.welcome)}>
            <RiChatCheckFill size={48} className={styles.green} />
            <div className={styles.line}>
              <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
                Project Approved - Ready for Next Phase
              </Typography>
              <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.lightgreen}>
                The community has approved this project. You can now transition it to the upcoming phase and enable
                registration and investment options.
              </Typography>
            </div>
            <div className={styles.actions}>
              <Button
                caption="Move to Upcoming Phase"
                color={"primary"}
                onClick={() => null}
                iconLeft={<RiArrowUpCircleFill size={24} />}
              />
            </div>
          </div>
        );
      }

      if (hasOwnership) {
        if (isYes) {
          return (
            <div className={classNames(styles.field, styles.welcome)}>
              <RiChatCheckFill size={48} className={styles.green} />
              <div className={styles.line}>
                <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
                  The project has been approved by the community
                </Typography>
                <Typography
                  as={"p"}
                  variant={"body"}
                  size={"medium"}
                  textAlign={"center"}
                  className={styles.lightgreen}
                >
                  Soon the registration and investment options will be enabled.
                </Typography>
              </div>
            </div>
          );
        }

        return (
          <div className={classNames(styles.field, styles.welcome)}>
            <RiChatDeleteFill size={48} className={styles.red} />
            <div className={styles.line}>
              <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
                Project Rejected
              </Typography>
              <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.lightgreen}>
                The project has been rejected because is not approved by more than 50% of the votes.
              </Typography>
            </div>
          </div>
        );
      }

      if (config.count[0] === config.count[1]) {
        return (
          <div className={classNames(styles.field, styles.welcome)}>
            <RiChatDeleteFill size={48} className={styles.red} />
            <div className={styles.line}>
              <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
                Project Rejected
              </Typography>
              <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.lightgreen}>
                The project has been rejected because is not approved by more than 50% of the votes.
              </Typography>
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
              The project has been {isYes ? "approved" : "rejected"} by the community.
            </Typography>

            {isYes && (
              <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.lightgreen}>
                Soon the registration and investment options will be enabled.
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
          {!myVote && new Date() > config.startDate && (
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

      {new Date() > config.startDate && (
        <>
          <div className={classNames(styles.inline, styles.data)}>
            <DataLabel
              label={"Total Votes"}
              value={formatNumber(
                config.count.reduce((acc, vote) => acc + vote, 0),
                0,
              )}
            />
            <Countdown date={new Date() < config.startDate ? config.startDate : config.limitDate}>
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

          {new Date() > config.startDate && (
            <GraphBar
              colors={["green", "red"]}
              disabled={[new Date() > config.limitDate && !isYes, new Date() > config.limitDate && isYes]}
              data={config.count}
            />
          )}
        </>
      )}
    </Fieldset>
  );
};
