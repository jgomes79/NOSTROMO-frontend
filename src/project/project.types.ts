import { z } from "zod";

import { ProjectSchema } from "@/project/project.schema";

/**
 * Enum representing the various states a project can be in.
 */
export enum ProjectStates {
  /**
   * Represents all project states combined.
   * Used for filtering purposes when all states should be included.
   */
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
   * The project is ready to be voted on.
   */
  READY_TO_VOTE = 3,

  /**
   * The project has been rejected.
   */
  REJECTED = 4,

  /**
   * The project is upcoming.
   */
  UPCOMING = 5,

  /**
   * The project is in the first phase of funding.
   */
  FUNDING_PHASE_1 = 6,

  /**
   * The project is in the second phase of funding.
   */
  FUNDING_PHASE_2 = 7,

  /**
   * The project is in the third phase of funding.
   */
  FUNDING_PHASE_3 = 8,

  /**
   * The project is closed.
   */
  CLOSED = 9,

  /**
   * The project has failed.
   */
  FAILED = 10,
}

/**
 * Type for the Project, inferred from the schema.
 */
export type Project = z.infer<typeof ProjectSchema>;

/**
 * Enum representing the different tabs available in the ProjectDetails component.
 *
 * @enum {string}
 */
export enum ProjectDetailsTabs {
  INFORMATION = "information",
  RAISING_INFORMATION = "raising-information",
  TOKEN_INFORMATION = "token-information",
  VESTING_OPTIONS = "vesting-options",
  STAKE_OPTIONS = "stake-options",
  PAYMENT_RULES = "payment-rules",
}
