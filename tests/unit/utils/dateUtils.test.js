import { describe, it, expect } from "vitest";
import { calculateDuration } from "@/utils/dateUtils";

describe("Date Utils functions", () => {
  it("Only years", async () => {
    const result = calculateDuration("2018-01", "2020-01");
    expect(result).toBe("2 years");
  });

  it("Only Months", async () => {
    const result = calculateDuration("2018-01", "2018-03");
    expect(result).toBe("2 months");
  });

  it("Years and Months", async () => {
    const result = calculateDuration("2018-01", "2020-03");
    expect(result).toBe("2 years 2 months");
  });
});
