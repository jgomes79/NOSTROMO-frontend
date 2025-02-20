import classNames from "clsx";
import { RiChatPollFill } from "react-icons/ri";

import { Fieldset } from "@/shared/components/Fieldset";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectComments.module.scss";

interface ProjectCommentsProps {
  readonly comments: string;
}

/**
 * ProjectVoting component renders the voting section for a project.
 *
 * @param {ProjectCommentsProps} props - The props for the component.
 * @returns {JSX.Element} The JSX code for the ProjectVoting component.
 */
export const ProjectComments: React.FC<ProjectCommentsProps> = ({ comments }) => {
  const defaultComments = {
    title: "This project has been returned with the following comments",
    description: comments,
  };

  return (
    <Fieldset title={"Comments"} className={styles.section}>
      <div className={classNames(styles.field, styles.welcome)}>
        <RiChatPollFill size={48} />
        <div className={styles.line}>
          <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
            {defaultComments.title}
          </Typography>
          <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.description}>
            {defaultComments.description}
          </Typography>
        </div>
      </div>
      <Separator />
    </Fieldset>
  );
};
