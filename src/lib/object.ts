/**
 * Compares two objects for equality by converting them to JSON strings.
 *
 * @param {object} obj1 - The first object to compare.
 * @param {object} obj2 - The second object to compare.
 * @returns {boolean} True if the objects are equal, false otherwise.
 */
export const isSameObject = (obj1: object, obj2: object): boolean => JSON.stringify(obj1) === JSON.stringify(obj2);
