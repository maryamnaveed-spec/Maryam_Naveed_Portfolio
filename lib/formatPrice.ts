/**
 * Formats a number as PKR currency deterministically.
 *
 * We deliberately avoid `Intl.NumberFormat`/`toLocaleString` with a
 * `style: 'currency'` option here: different ICU builds on the server
 * (Node.js on Vercel) vs. the browser render "PKR" differently ("Rs" vs
 * "PKR"), which produces a React hydration mismatch ("Text content did
 * not match"). Formatting the thousands separator ourselves and always
 * prefixing a literal "PKR" keeps server and client output identical.
 */
export function formatPKR(amount: number): string {
  const rounded = Math.round(amount);
  return `PKR ${rounded.toLocaleString('en-US')}`;
}
