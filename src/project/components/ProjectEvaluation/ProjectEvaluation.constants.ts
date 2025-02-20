import { ProjectReviewStatus } from "@/project/project.types";
import { ConfirmationModalProps } from "@/shared/modals/ConfirmationModal";

/**
 * Labels for confirmation modals based on project review status.
 * @type {Record<ProjectReviewStatus, { title: string; description: string }>}
 */
export const confirmationLabels: Record<ProjectReviewStatus, { title: string; description: string }> = {
  [ProjectReviewStatus.APPROVED]: {
    title: "Approve Project",
    description:
      "This action cannot be undone; once the project is approved, it moves to the registration phase, becomes published, and is visible on the platform.",
  },
  [ProjectReviewStatus.REQUEST_MORE_INFO]: {
    title: "Request More Information",
    description:
      "Does not reject the project, but requests more information from the creator to provide a better evaluation.",
  },
  [ProjectReviewStatus.REJECTED]: {
    title: "Reject Project",
    description: "This action cannot be undone.",
  },
};

/**
 * Labels for toast notifications based on project review status.
 * @type {Record<ProjectReviewStatus, { title: string; description: string }>}
 */
export const toastLabels: Record<ProjectReviewStatus, { title: string; description: string }> = {
  [ProjectReviewStatus.APPROVED]: {
    title: "Project Approved Successfully",
    description: "The project creator has been notified.",
  },
  [ProjectReviewStatus.REQUEST_MORE_INFO]: {
    title: "Request Sent",
    description: "The creator will be notified to provide more information.",
  },
  [ProjectReviewStatus.REJECTED]: {
    title: "Project Rejected Successfully",
    description: "The project creator has been notified.",
  },
};

/**
 * Variants for the confirmation modal based on project review status.
 * @type {Record<ProjectReviewStatus, ConfirmationModalProps["type"]>}
 */
export const confirmationVariants: Record<ProjectReviewStatus, ConfirmationModalProps["type"]> = {
  [ProjectReviewStatus.APPROVED]: "success",
  [ProjectReviewStatus.REQUEST_MORE_INFO]: "info",
  [ProjectReviewStatus.REJECTED]: "error",
};

/**
 * Object containing literals for different user modes.
 * @type {{admin: {title: string, description: string}, user: {title: string, description: string}}}
 */
export const mainLiterals = {
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
