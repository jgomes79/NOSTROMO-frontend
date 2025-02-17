import { z } from "zod";

import { ProjectFormSchema } from "./ProjectForm.schema";

/**
 * Type definition for the values derived from the ProjectFormSchema using Zod's infer method.
 */
export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

/**
 * Type definition for the properties expected by the ProjectNameForm component.
 */
export interface ProjectFormProps {
  /**
   * Indicates if the form is loading.
   */
  readonly isLoading: boolean;
  /**
   * Initial values for the form fields, based on the ProjectFormSchema.
   */
  readonly defaultValues?: Partial<ProjectFormValues>;
  /**
   * Callback function that executes upon form submission.
   */
  readonly onSubmit: (isPublishing: boolean, data: ProjectFormValues) => void;
}
