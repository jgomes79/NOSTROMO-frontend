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
