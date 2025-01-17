import { useMutation } from "@tanstack/react-query";

import { User } from "@/user/user.types";

import { initProject } from "../project.service";
import { Project } from "../project.types";

/**
 * Custom hook to initialize a new project using a mutation.
 *
 * @returns {ReturnType<typeof useMutation>} - The mutation object for initializing a project.
 */
export const useInitProject = () =>
  useMutation<Pick<Project, "id">, Error, User["wallet"]>({
    /**
     * Mutation function to initialize a new project.
     *
     * @param {User["wallet"]} walletAddress - The wallet address to associate with the new project.
     * @returns {Promise<Pick<Project, "id">>} - A promise that resolves to an object containing the project ID.
     */
    mutationFn: (walletAddress: User["wallet"]) => initProject(walletAddress),
  });
