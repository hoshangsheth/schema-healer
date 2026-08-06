/** Display helpers shared by the report, mapping table and preview. */

export function formatPercent(value: number, fractionDigits = 1): string {
  const rounded = Number(value.toFixed(fractionDigits));
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(fractionDigits)}%`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

/** `first_name` -> `First name`, for readable canonical field labels. */
export function humanizeFieldName(field: string): string {
  const spaced = field.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Truncate long cell values without breaking the table layout. */
export function truncate(value: string, max = 60): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
