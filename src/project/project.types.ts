import { z } from "zod";

import { ProjectSchema } from "@/project/project.schema";

/**
 * Enum representing the various states a project can be in.
 */
export enum ProjectStates {
  /**
   * The project is in draft state.
   */
  DRAFT = 0,

  /**
   * The project requires more information.
   */
  REQUEST_MORE_INFO = 1,

  /**
   * The project is ready to be voted on.
   */
  READY_TO_VOTE = 2,

  /**
   * The project has been rejected.
   */
  REJECTED = 3,

  /**
   * The project is upcoming.
   */
  UPCOMING = 4,

  /**
   * The project is in the first phase of funding.
   */
  FUNDING_PHASE_1 = 5,

  /**
   * The project is in the second phase of funding.
   */
  FUNDING_PHASE_2 = 6,

  /**
   * The project is in the third phase of funding.
   */
  FUNDING_PHASE_3 = 7,

  /**
   * The project is closed.
   */
  CLOSED = 8,

  /**
   * The project has failed.
   */
  FAILED = 9,
}

/**
 * Type for the Project, inferred from the schema.
 */
export type Project = z.infer<typeof ProjectSchema>;
