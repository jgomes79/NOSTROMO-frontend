import { getEndpoint, request, requestWithFile } from "@/core/api/api.helpers";
import { Project, ProjectStates } from "@/project/project.types";
import { User } from "@/user/user.types";

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
 * Fetches a project by its ID.
 *
 * @param {string} id - The unique identifier (ID) of the project.
 * @returns {Promise<Project>} - A promise that resolves to the project data.
 */
export const getProjectById = (id: Project["id"]): Promise<Project> =>
  request<Project>(getEndpoint("projects-service", `/project/${id}`), {
    method: "GET",
  });

/**
 * Initializes a new project with the given wallet address.
 *
 * @param {User["wallet"]} walletAddress - The wallet address to associate with the new project.
 * @returns {Promise<Pick<Project, "id">>} - A promise that resolves to an object containing the project ID.
 */
export const initProject = (walletAddress: User["wallet"]): Promise<Pick<Project, "id">> =>
  request<Pick<Project, "id">>(getEndpoint("projects-service", `/initialize`), {
    method: "POST",
    data: {
      walletAddress,
    },
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
 * Creates a new project.
 *
 * @param {FormData} data - The form data containing project details.
 * @returns {Promise<Project>} - A promise that resolves to the newly created project data.
 */
export const createProject = (data: FormData): Promise<Project> =>
  requestWithFile<Project>(getEndpoint("projects-service", "/projects/create"), data);
