/**
 * Gets the snap origin to use.
 * @param configuredOrigin Optional custom snap origin from config
 * @returns The snap origin to use - either the configured one or the default npm package
 */
export const getSnapOrigin = (configuredOrigin?: string) => configuredOrigin ?? "npm:@qubic-lib/qubic-mm-snap";
