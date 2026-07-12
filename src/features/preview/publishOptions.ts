export type LiveUntilOption =
  | "always"
  | "1_week"
  | "2_weeks"
  | "3_weeks"
  | "1_month"
  | "custom";

export const LIVE_UNTIL_OPTIONS: { value: LiveUntilOption; label: string }[] = [
  { value: "always", label: "Always Available" },
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "3_weeks", label: "3 Weeks" },
  { value: "1_month", label: "1 Month" },
  { value: "custom", label: "Custom Duration" },
];

export function computeExpiryDate(
  option: LiveUntilOption,
  customDate: string,
  customTime: string,
): string | null {
  const base = new Date();
  switch (option) {
    case "always":
      return null;
    case "1_week":
      base.setDate(base.getDate() + 7);
      return base.toISOString();
    case "2_weeks":
      base.setDate(base.getDate() + 14);
      return base.toISOString();
    case "3_weeks":
      base.setDate(base.getDate() + 21);
      return base.toISOString();
    case "1_month":
      base.setMonth(base.getMonth() + 1);
      return base.toISOString();
    case "custom": {
      if (!customDate) return null;
      const iso = `${customDate}T${customTime || "23:59"}:00`;
      const parsed = new Date(iso);
      return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
    }
    default:
      return null;
  }
}
