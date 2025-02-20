/**
 * Trims a string to a specified length and adds an ellipsis if the string exceeds the length.
 *
 * @param {string} str - The string to be trimmed.
 * @param {number} length - The maximum length of the trimmed string.
 * @returns {string} - The trimmed string with an ellipsis if it exceeds the specified length.
 */
export const trimString = (str: string, length: number): string => {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length) + "...";
};

/**
 * Generates a URL-friendly slug from a given string.
 * @param input - The string to generate a slug from.
 * @returns A URL-friendly slug.
 */
export const generateSlugOf = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Generates a random key of a specified length.
 *
 * @param {number} length - The length of the random key to generate.
 * @returns {string} - The generated random key.
 */
export const generateRandomKey = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
};
