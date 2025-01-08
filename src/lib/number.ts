/**
 * Formats a number as a price with currency symbol and decimals.
 * @param value The numeric value to format
 * @param currency The currency code (defaults to 'USD')
 * @param decimals The number of decimal places to show (defaults to 2)
 * @returns The formatted price as a string
 */
export function formatPrice(value: number, currency?: string, decimals: number = 2): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${formatter.format(value)} ${currency ?? ""}`;
}

/**
 * Formats a number with a specified number of decimal places.
 * @param value The numeric value to format
 * @param decimals The number of decimal places to show (defaults to 2)
 * @returns The formatted number as a string
 */
export const formatNumber = (value: number, decimals: number = 2): string => formatPrice(value, undefined, decimals);
