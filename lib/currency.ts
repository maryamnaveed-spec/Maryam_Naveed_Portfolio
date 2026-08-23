// Intl's `style: 'currency'` picks a currency *display name* ("Rs" vs "PKR")
// based on the ICU data available in the runtime - Node on the server and
// the browser on the client can disagree, which breaks React hydration
// (server renders "Rs 1,000", browser re-renders "PKR 1,000"). Formatting
// the number ourselves with a fixed locale for digit grouping only, and a
// hardcoded "PKR" prefix, keeps server and client output byte-identical.
export function formatPKR(amount: number): string {
  const rounded = Math.round(amount);
  return `PKR ${rounded.toLocaleString('en-US')}`;
}
