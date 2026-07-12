import type { TestType } from "@/types";

export const TEST_TYPE_LABEL: Record<TestType, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

export function testTypeLabel(type: TestType): string {
  return TEST_TYPE_LABEL[type] ?? type;
}
