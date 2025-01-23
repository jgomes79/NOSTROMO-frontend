import { getEndpoint, request, requestWithFile } from "@/core/api/api.helpers";
import { Project, ProjectStates } from "@/project/project.types";

/**
 * Fetches a project by its slug.
 *
 * @param {string} slug - The unique identifier (slug) of the project.
 * @returns {Promise<Project>} - A promise that resolves to the project data.
 */
export const getProjectBySlug = (slug: Project["slug"]): Promise<Project> =>
  request<Project>(getEndpoint("projects-service", `/project/${slug}`), {
    method: "GET",
  });

/**
 * Type representing the response from the getProjects API.
 *
 * @property {Project[]} rows - An array of projects.
 * @property {number} count - The total number of projects.
 */
export type GetProjectsResponse = {
  rows: Project[];
  count: number;
};

/**
 * Fetches a list of projects by their state and page number.
 *
 * @param {number} page - The page number to fetch.
 * @param {ProjectStates} state - The state of the projects to fetch.
 * @returns {Promise<Project[]>} - A promise that resolves to an array of project data.
 */
export const getProjects = (page: number, state: ProjectStates) =>
  request<GetProjectsResponse>(getEndpoint("projects-service", `/projects/${state}`), {
    method: "GET",
    params: {
      page,
    },
  });

/**
 * Creates or updates a project.
 *
 * @param {string} id - The unique identifier of the project. If not provided, a new project will be created.
 * @param {FormData} data - The form data containing project details.
 * @returns {Promise<Project>} - A promise that resolves to the created or updated project data.
 */
export const upsertProject = (id: Project["id"] | undefined, data: FormData): Promise<Project> =>
  requestWithFile<Project>(getEndpoint("projects-service", id ? `/projects/${id}/update` : "/projects/create"), data);
