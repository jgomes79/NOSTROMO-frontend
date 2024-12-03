/**
 * Formats a number as a price with currency symbol and decimals.
 * @param value The numeric value to format
 * @param currency The currency code (defaults to 'USD')
 * @param decimals The number of decimal places to show (defaults to 2)
 * @returns The formatted price as a string
 */
export function formatPrice(value: number, currency: string = "USD", decimals: number = 2): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${formatter.format(value)} ${currency}`;
}
