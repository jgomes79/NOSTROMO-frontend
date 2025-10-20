import { useCallback } from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { Button } from "../../../shared/components/Button";
import { Fieldset } from "../../../shared/components/Fieldset";
import { Typography } from "../../../shared/components/Typography";
import { useCreateFundraising } from "../../../wallet/hooks/useCreateFundraising";

import { differenceInCalendarDays } from "date-fns";
import { Project } from "../../project.types";
import styles from "./ProjectPendingToCreate.module.scss";

/**
 * Props for the ProjectPendingToCreate component.
 * @param {Project} project - The project to be published.
 */
interface ProjectPendingToCreateProps {
  project: Project;
}

/**
 * Component to display a project that is pending to be created.
 * @param {ProjectPendingToCreateProps} props - The props for the component.
 * @returns {React.ReactNode} The component to be rendered.
 */
export const ProjectPendingToCreate: React.FC<ProjectPendingToCreateProps> = ({ project }) => {
  const createFundraising = useCreateFundraising();

  /**
   * Handles the click event to publish the project.
   * @returns {Promise<void>} A promise that resolves when the project is published.
   */
  const handleClickCreateFundraising = useCallback(async () => {
    console.log("🚀 project:", project);
    if (!project.smartContractId) {
      return new Error("SmartcontractId is missing");
    }

    const firstPhaseStartDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    const firstPhaseEndDate = new Date(firstPhaseStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const secondPhaseStartDate = new Date(firstPhaseEndDate.getTime() + 24 * 60 * 60 * 1000);
    const secondPhaseEndDate = new Date(secondPhaseStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const thirdPhaseStartDate = new Date(secondPhaseEndDate.getTime() + 24 * 60 * 60 * 1000);
    const thirdPhaseEndDate = new Date(thirdPhaseStartDate.getTime() + 15 * 24 * 60 * 60 * 1000);

    const cliffEndDate = new Date(project.TGEDate.getTime() + project.cliff * 24 * 60 * 60 * 1000);
    const vestingEndDate = new Date(cliffEndDate.getTime() + project.vestingDays * 24 * 60 * 60 * 1000);

    const e = differenceInCalendarDays(cliffEndDate, vestingEndDate);
    console.log("🚀 e:", e);

    await createFundraising.mutate({
      tokenPrice: project.tokenPrice * 1000000, // 1 QU in microqubics
      soldAmount: project.tokensForSale, // 1B tokens
      requiredFunds: project.amountToRaise, // 1M QU in microqubics
      indexOfProject: project.smartContractId, // Use project ID as index

      // Phase 1 (ICO Phase) - Example dates
      firstPhaseStartDate,
      firstPhaseStartHour: 0,
      firstPhaseEndDate,
      firstPhaseEndHour: 23,

      // Phase 2 (Public Sale)
      secondPhaseStartDate,
      secondPhaseStartHour: 0,
      secondPhaseEndDate,
      secondPhaseEndHour: 23,

      // Phase 3 (Final Sale)
      thirdPhaseStartDate,
      thirdPhaseStartHour: 0,
      thirdPhaseEndDate,
      thirdPhaseEndHour: 23,

      // Token Economics
      listingStartDate: project.TGEDate,
      listingStartHour: 0,
      cliffEndDate,
      cliffEndHour: 0,
      vestingEndDate,
      vestingEndHour: 0,

      threshold: project.threshold,
      TGE: project.unlockTokensTGE, // 20% at TGE
      stepOfVesting: 10, // 10% monthly vesting
    });
  }, [createFundraising]);

  return (
    <Fieldset title={"Creation Phase"} variant={"default"}>
      <div className={styles.container}>
        <RiCheckboxCircleLine size={52} className={styles.green} />
        <div className={styles.content}>
          <Typography as={"h1"} variant={"heading"} size={"large"} textAlign={"center"} className={styles.green}>
            Project ready to publish!
          </Typography>
          <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.gray}>
            Your project has been approved by the community and is ready to be published.
            <br />
            Click the button to complete the process.
          </Typography>
        </div>
        <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"center"}>
          <Button
            onClick={handleClickCreateFundraising}
            caption="Create Fundraising"
            isLoading={createFundraising.isLoading}
          />
        </Typography>
      </div>
    </Fieldset>
  );
};
