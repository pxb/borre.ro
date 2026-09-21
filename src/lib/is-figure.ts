/* Mono is reserved for numbers. Metric values are sometimes words
   ("Minutes", "Next day"), and those belong in the sans face. */
export function isFigure(value: string): boolean {
  return /^[~<>]?[\u00a3$\u20ac]?\d/.test(value.trim());
}
