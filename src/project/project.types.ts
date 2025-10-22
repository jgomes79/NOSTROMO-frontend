import { z } from "zod";

import { ProjectSchema } from "@/project/project.schema";

/**
 * Enum representing the various states a project can be in.
 */
export enum ProjectStates {
  ALL = "all",

  /**
   * The project is in draft state.
   */
  DRAFT = 0,

  /**
   * Sent to review
   */
  SENT_TO_REVIEW = 1,

  /**
   * The project requires more information.
   */
  REQUEST_MORE_INFO = 2,

  /**
   * The project is in voting phase.
   */
  PENDING_TO_CREATE = 3,

  /**
   * The project is ready to be voted on.
   */
  READY_TO_VOTE = 4,

  /**
   * The project has been rejected.
   */
  REJECTED = 5,

  /**
   * The project is upcoming.
   */
  UPCOMING = 6,

  /**
   * The project is in the pending to create phase.
   */
  PENDING_TO_CREATE_FUNDRAISING = 7,

  /**
   * The project is in the first phase of funding.
   */
  FUNDING_PHASE_1 = 8,

  /**
   * The project is in the second phase of funding.
   */
  FUNDING_PHASE_2 = 9,

  /**
   * The project is in the third phase of funding.
   */
  FUNDING_PHASE_3 = 10,

  /**
   * The project is closed.
   */
  CLOSED = 11,

  /**
   * The project has failed.
   */
  FAILED = 12,
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
