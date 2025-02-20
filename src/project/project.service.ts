import { getEndpoint, request, requestWithFile } from "@/core/api/api.helpers";
import { Project, ProjectReviewStatus, ProjectStates } from "@/project/project.types";
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

/**
 * Type representing the response from the getProjectsByWallet API.
 *
 * @property {Project[]} rows - An array of projects associated with the wallet.
 * @property {number} count - The total number of projects for the wallet.
 */
export type GetProjectsByWalletResponse = {
  rows: Project[];
  count: number;
};

/**
 * Fetches projects associated with a specific wallet address.
 *
 * @param {Project["owner"]["wallet"]} wallet - The wallet address to fetch projects for.
 * @param {ProjectStates | "all"} state - The state of projects to fetch ("all" or specific ProjectStates)
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The maximum number of projects to return per page.
 * @returns {Promise<GetProjectsByWalletResponse>} - A promise that resolves to an object containing:
 *   - rows: Array of projects associated with the wallet
 *   - count: Total number of projects for the wallet
 */
export const getProjectsByWallet = (
  wallet: Project["owner"]["wallet"],
  state: ProjectStates | "all",
  page: number,
  limit: number,
) =>
  request<GetProjectsByWalletResponse>(getEndpoint("projects-service", `/projects/wallet/${wallet}`), {
    method: "GET",
    params: {
      page,
      state,
      limit,
    },
  });

/**
 * Publishes a project by its ID.
 *
 * @param {Project["id"]} projectId - The unique identifier of the project to publish.
 * @returns {Promise<void>} - A promise that resolves when the project is successfully published.
 */
export const publishProject = (projectId: Project["id"]) =>
  request<Project>(getEndpoint("projects-service", `/projects/${projectId}/publish`), {
    method: "POST",
  });

/**
 * Type representing the response from the getProjectsVip API.
 *
 * @property {Project[]} rows - An array of VIP projects.
 * @property {number} count - The total number of VIP projects.
 */
export type GetProjectsVipResponse = {
  rows: Project[];
  count: number;
};

/**
 * Fetches VIP projects from the projects service.
 *
 * @returns {Promise<GetProjectsVipResponse>} - A promise that resolves to an object containing:
 *   - rows: An array of VIP projects.
 *   - count: Total number of VIP projects.
 */
export const getProjectsVip = () =>
  request<GetProjectsVipResponse>(getEndpoint("projects-service", "/projects/vip/all"), {
    method: "GET",
  });

/**
 * Represents the data structure for the review project request.
 *
 * @typedef {Object} ReviewProjectData
 * @property {ProjectReviewStatus} response - The review status of the project, indicating whether it was approved, rejected, or requires more information.
 * @property {string} comments - Comments provided during the review process, offering feedback or additional context.
 */
export type ReviewProjectData = {
  response: ProjectReviewStatus;
  comments: string;
};

/**
 * Submits a review for a specific project.
 *
 * @param {Project["id"]} id - The unique identifier of the project being reviewed.
 * @param {ReviewProjectData} reviewData - An object containing the review status and comments for the project.
 * @returns {Promise<void>} - A promise that resolves when the review submission is complete.
 */
export const reviewProject = (id: Project["id"], wallet: User["wallet"], { response, comments }: ReviewProjectData) =>
  request<void>(getEndpoint("projects-service", `/projects/${id}/${wallet}/review`), {
    method: "POST",
    data: {
      response,
      comments,
    },
  });
