import type { TestStatus } from "@/types";

type Tone = "success" | "warning" | "danger" | "primary" | "neutral";

export const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  live: "Live",
  unpublished: "Unpublished",
  expired: "Expired",
};

export const STATUS_TONE: Record<string, Tone> = {
  draft: "neutral",
  scheduled: "warning",
  live: "success",
  unpublished: "danger",
  expired: "danger",
};

export function statusLabel(status: TestStatus): string {
  if (!status) return "Draft";
  return STATUS_LABEL[status] ?? status;
}

export function statusTone(status: TestStatus): Tone {
  if (!status) return "neutral";
  return STATUS_TONE[status] ?? "neutral";
}
