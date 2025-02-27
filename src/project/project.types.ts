import { z } from "zod";

import { ProjectSchema } from "@/project/project.schema";

/**
 * Enum representing the various states a project can be in.
 *
 * - ALL: Represents all project states combined, used for filtering purposes
 * - DRAFT: The project is in draft state
 * - SENT_TO_REVIEW: The project has been sent for review
 * - REQUEST_MORE_INFO: The project requires more information
 * - READY_TO_VOTE: The project is ready to be voted on
 * - REJECTED: The project has been rejected
 * - UPCOMING: The project is upcoming
 * - FUNDING_PHASE_1: The project is in the first phase of funding
 * - FUNDING_PHASE_2: The project is in the second phase of funding
 * - FUNDING_PHASE_3: The project is in the third phase of funding
 * - CLOSED: The project is closed
 * - FAILED: The project has failed
 */
export enum ProjectStates {
  ALL = "all",
  DRAFT = 0,
  SENT_TO_REVIEW = 1,
  REQUEST_MORE_INFO = 2,
  READY_TO_VOTE = 3,
  REJECTED = 4,
  UPCOMING = 5,
  FUNDING_PHASE_1 = 6,
  FUNDING_PHASE_2 = 7,
  FUNDING_PHASE_3 = 8,
  CLOSED = 9,
  FAILED = 10,
}

/**
 * Type for the Project, inferred from the schema.
 */
export type Project = z.infer<typeof ProjectSchema>;

/**
 * Enum representing the different tabs in the project form.
 */
export enum ProjectFormTabs {
  BASIC_INFORMATION = "basic-information",
  SOCIAL_NETWORKS = "social-networks",
  DOCUMENTATION = "documentation",
  TOKEN_INFORMATION = "token-information",
  RAISING_FUNDS = "raising-funds",
  VESTING_OPTIONS = "vesting-options",
}

/**
 * Enum representing the possible review statuses of a project.
 */
export enum ProjectReviewStatus {
  REJECTED = 0,
  APPROVED = 1,
  REQUEST_MORE_INFO = 2,
}
