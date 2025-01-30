import { z } from "zod";

import { ProjectFormSchema } from "./ProjectForm.schema";

/**
 * Type definition for the values derived from the ProjectFormSchema using Zod's infer method.
 */
export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

/**
 * Type definition for the properties expected by the ProjectNameForm component.
 * @param defaultValues - Initial values for the form fields, based on the ProjectFormSchema.
 * @param onSubmit - Callback function that executes upon form submission.
 * @param onCancel - Callback function that executes to navigate back from the form.
 */
export interface ProjectFormProps {
  isLoading: boolean;
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (isPublishing: boolean, data: ProjectFormValues) => void;
}
