import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { RiSearchEyeLine } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { useModal } from "@/core/modals/hooks/useModal";
import { ModalsIds } from "@/core/modals/modals.types";
import { ToastIds, useToast } from "@/core/toasts/hooks/useToast";
import { useReviewProject } from "@/project/hooks/useReviewProject";
import { Project, ProjectReviewStatus } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { TextArea } from "@/shared/components/TextArea";
import { Typography } from "@/shared/components/Typography";
import { useUserByWallet } from "@/user/hooks/useUserByWallet";
import { User } from "@/user/user.types";

import { confirmationLabels, confirmationVariants, mainLiterals, toastLabels } from "./ProjectEvaluation.constants";
import styles from "./ProjectEvaluation.module.scss";

interface ProjectEvaluationProps {
  projectId: Project["id"];
  admin: {
    wallet: User["wallet"];
  };
}

/**
 * ProjectEvaluation component renders the project evaluation section.
 *
 * @returns {JSX.Element} The JSX code for ProjectEvaluation component.
 */
export const ProjectEvaluation: React.FC<ProjectEvaluationProps> = ({ projectId, admin }) => {
  const reviewProject = useReviewProject();
  const { data } = useWalletClient();
  const { data: user } = useUserByWallet(data?.account.address);
  const { openModal, closeModal } = useModal();
  const { createToast } = useToast();

  const isAdmin = user?.type === "admin";
  const mode = isAdmin ? "admin" : "user";

  const { register, reset, getValues } = useForm<{ comment: string }>({
    defaultValues: {
      comment: "",
    },
    reValidateMode: "onChange",
    mode: "all",
  });

  /**
   * Handles the confirmation of a project review.
   *
   * This function is called when the user confirms their review decision.
   * It triggers the mutation to submit the review status and comments for the specified project.
   *
   * @param {ProjectReviewStatus} response - The review status indicating the outcome of the evaluation.
   * @param {(loading: boolean) => void} setLoading - A function to set the loading state for the confirmation process.
   * @returns {void} This function does not return a value.
   */
  const onConfirm = useCallback(
    (response: ProjectReviewStatus, setLoading: (loading: boolean) => void) => {
      setLoading(true);
      reviewProject.mutate(
        {
          id: projectId,
          wallet: admin.wallet,
          data: {
            response,
            comments: getValues("comment"),
          },
        },
        {
          onSuccess: () => {
            reset();
            createToast(ToastIds.CONFIRMATION, {
              type: "success",
              title: toastLabels[response].title,
              description: toastLabels[response].description,
            });
            closeModal();
          },
          onError: () => {
            setLoading(false);
            createToast(ToastIds.CONFIRMATION, {
              type: "error",
              title: "An unexpected error occurred",
              description: "Please try again. If the error persists, contact support.",
            });
          },
        },
      );
    },
    [projectId, admin.wallet, getValues, reviewProject, createToast],
  );

  /**
   * Handles the review submission for the project.
   *
   * This function triggers the mutation to submit the review status and comments
   * for the specified project. It uses the `reviewProject` hook to perform the mutation.
   *
   * @param {ProjectReviewStatus} response - The review status indicating the outcome of the evaluation.
   * @returns {void} This function does not return a value.
   */
  const handleClickReview = (response: ProjectReviewStatus) => {
    openModal(ModalsIds.CONFIRMATION, {
      type: confirmationVariants[response],
      title: confirmationLabels[response].title,
      description: confirmationLabels[response].description,
      ...(response === ProjectReviewStatus.REQUEST_MORE_INFO && {
        element: (isLoading: boolean) => <TextArea label="Comments" {...register("comment")} disabled={isLoading} />,
      }),
      onConfirm: {
        caption: "Confirm",
        action: (setLoading) => onConfirm(response, setLoading),
      },
      onDecline: {
        caption: "Cancel",
        action: closeModal,
      },
    });
  };

  return (
    <Card className={styles.layout}>
      <RiSearchEyeLine size={48} />
      <div className={styles.field}>
        <Typography as={"h2"} variant={"heading"} size={"medium"} textAlign={"center"}>
          {mainLiterals[mode].title}
        </Typography>
        <Typography as={"h2"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.description}>
          {mainLiterals[mode].description}
        </Typography>
      </div>

      {isAdmin && (
        <div className={styles.actions}>
          <Button caption="Accept" color={"primary"} onClick={() => handleClickReview(ProjectReviewStatus.APPROVED)} />
          <Button
            caption="Request info"
            color={"warning"}
            onClick={() => handleClickReview(ProjectReviewStatus.REQUEST_MORE_INFO)}
          />
          <Button caption="Reject" color={"error"} onClick={() => handleClickReview(ProjectReviewStatus.REJECTED)} />
        </div>
      )}
    </Card>
  );
};
