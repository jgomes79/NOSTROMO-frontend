import { useWalletClient } from "wagmi";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Loader } from "@/shared/components/Loader";
import { Typography } from "@/shared/components/Typography";
import { useUserByWallet } from "@/user/hooks/useUserByWallet";

import styles from "./ProjectEvaluation.module.scss";

/**
 * ProjectEvaluation component renders the project evaluation section.
 *
 * @returns {JSX.Element} The JSX code for ProjectEvaluation component.
 */
export const ProjectEvaluation: React.FC = () => {
  const { data } = useWalletClient();
  const { data: user } = useUserByWallet(data?.account.address);

  const isAdmin = user?.type === "admin";
  const mode = isAdmin ? "admin" : "user";

  /**
   * Object containing literals for different user modes.
   * @type {{admin: {title: string, description: string}, user: {title: string, description: string}}}
   */
  const literals = {
    admin: {
      title: "Pending Review",
      description:
        "This project is pending review. Please evaluate it and determine if it is suitable to be published on the platform.",
    },
    user: {
      title: "Pending Review",
      description:
        "This project is pending review. It will be evaluated by the Nostromo team before being made official for the rest of the community.",
    },
  };

  const handleAccept = () => {
    console.log("Accept");
  };

  const handleRequestMoreInformation = () => {
    console.log("Request More Information");
  };

  const handleReject = () => {
    console.log("Reject");
  };

  return (
    <Card className={styles.layout}>
      <Loader size={52} />
      <div className={styles.field}>
        <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
          {literals[mode].title}
        </Typography>
        <Typography as={"h2"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.description}>
          {literals[mode].description}
        </Typography>
      </div>

      {isAdmin && (
        <div className={styles.actions}>
          <Button caption="Accept" color={"secondary"} onClick={handleAccept} />
          <Button caption="Request info" color={"yellow"} onClick={handleRequestMoreInformation} />
          <Button caption="Reject" color={"red"} onClick={handleReject} />
        </div>
      )}
    </Card>
  );
};
