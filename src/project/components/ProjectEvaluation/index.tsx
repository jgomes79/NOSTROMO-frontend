import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { RiSearchEyeLine } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { useModal } from "@/core/modals/hooks/useModal";
import { ModalsIds } from "@/core/modals/modals.types";
import { useReviewProject } from "@/project/hooks/useReviewProject";
import { Project, ProjectReviewStatus } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { TextArea } from "@/shared/components/TextArea";
import { Typography } from "@/shared/components/Typography";
import { ConfirmationModalProps } from "@/shared/modals/ConfirmationModal";
import { useUserByWallet } from "@/user/hooks/useUserByWallet";
import { User } from "@/user/user.types";

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

  const isAdmin = user?.type === "admin";
  const mode = isAdmin ? "admin" : "user";

  const { register, getValues } = useForm<{ comment: string }>({
    defaultValues: {
      comment: "",
    },
    reValidateMode: "onChange",
    mode: "all",
  });

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
            closeModal();
            setLoading(false);
          },
          onError: () => {
            setLoading(false);
          },
        },
      );
    },
    [projectId, admin.wallet, getValues, reviewProject],
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
    const labels: Record<ProjectReviewStatus, { title: string; description: string }> = {
      [ProjectReviewStatus.APPROVED]: {
        title: "Aprobar proyecto",
        description:
          "Esta acción no se puede deshacerse, una vez que el proyecto es aprobado pasa a fase de registro, queda publicado y visible en la plataforma.",
      },
      [ProjectReviewStatus.REQUEST_MORE_INFO]: {
        title: "Solicitar más información",
        description:
          "No rechaza el proyecto, pero solicita mas informacion al creador para aportar una mejor evaluación.",
      },
      [ProjectReviewStatus.REJECTED]: {
        title: "Rechazar proyecto",
        description: "Esta accion no puede deshacerse.",
      },
    };

    const variants: Record<ProjectReviewStatus, ConfirmationModalProps["type"]> = {
      [ProjectReviewStatus.APPROVED]: "success",
      [ProjectReviewStatus.REQUEST_MORE_INFO]: "info",
      [ProjectReviewStatus.REJECTED]: "error",
    };

    openModal(ModalsIds.CONFIRMATION, {
      type: variants[response],
      title: labels[response].title,
      description: labels[response].description,
      ...(response === ProjectReviewStatus.REQUEST_MORE_INFO && {
        element: <TextArea label="Comments" {...register("comment")} />,
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
          {literals[mode].title}
        </Typography>
        <Typography as={"h2"} variant={"body"} size={"medium"} textAlign={"center"} className={styles.description}>
          {literals[mode].description}
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
