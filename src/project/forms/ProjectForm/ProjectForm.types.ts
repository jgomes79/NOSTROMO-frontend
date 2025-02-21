import { z } from "zod";

import { Project } from "@/project/project.types";

import { ProjectFormSchema } from "./ProjectForm.schema";

/**
 * Type definition for the values derived from the ProjectFormSchema using Zod's infer method.
 */
export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

/**
 * Type definition for the properties expected by the ProjectNameForm component.
 *
 * @property {boolean} isLoading - Indicates if the form is loading.
 * @property {Project["comments"]} comments - The comments associated with the project.
 * @property {Partial<ProjectFormValues>} [defaultValues] - Initial values for the form fields, based on the ProjectFormSchema.
 * @property {(isPublishing: boolean, data: ProjectFormValues) => void} onSubmit - Callback function that executes upon form submission.
 */
export interface ProjectFormProps {
  readonly isLoading: boolean;
  readonly comments?: Project["comments"];
  readonly defaultValues?: Partial<ProjectFormValues>;
  readonly onSubmit: (isPublishing: boolean, data: ProjectFormValues) => void;
}
