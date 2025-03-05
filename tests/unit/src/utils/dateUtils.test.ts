import { describe, it, expect } from "vitest";
import { calculateDuration } from "@/utils/dateUtils";

describe("Date Utils functions", () => {
  describe("calculateDuration function", () => {
    it("Only 1 year", () => {
      const result: string = calculateDuration("2022-06", "2023-06");
      expect(result).toBe("1 year");
    });

    it("Only 1 month", () => {
      const result: string = calculateDuration("2023-05", "2023-06");
      expect(result).toBe("1 month");
    });

    it("Multiple years and 1 month", () => {
      const result: string = calculateDuration("2020-01", "2023-02");
      expect(result).toBe("3 years 1 month");
    });

    it("Multiple years and multiple months", () => {
      const result: string = calculateDuration("2018-01", "2020-03");
      expect(result).toBe("2 years 2 months");
    });

    it("End date as 'Present'", () => {
      const result: string = calculateDuration("2020-01", "Present");
      const currentDate: Date = new Date();
      const expectedYears: number = currentDate.getFullYear() - 2020;
      const expectedMonths: number = currentDate.getMonth();

      const yearText: string = expectedYears === 1 ? "year" : "years";
      const monthText: string = expectedMonths === 1 ? "month" : "months";

      const expectedText: string =
        expectedMonths > 0
          ? `${expectedYears} ${yearText} ${expectedMonths} ${monthText}`
          : `${expectedYears} ${yearText}`;

      expect(result).toBe(expectedText);
    });

    describe("Edge cases", () => {
      it("Zero duration (same start and end date)", () => {
        const result: string = calculateDuration("2023-05", "2023-05");
        expect(result).toBe("");
      });

      it("Less than a month difference", () => {
        const result: string = calculateDuration("2023-05-15", "2023-05-20");
        expect(result).toBe("");
      });

      it("Negative duration (start date after end date)", () => {
        const result: string = calculateDuration("2024-06", "2023-06");
        expect(result).toBe("");
      });

      it("Start month greater than end month (1 year 4 months)", () => {
        const result: string = calculateDuration("2022-10", "2024-03");
        expect(result).toBe("1 year 5 months");
      });

      it("Start month greater than end month (2 years 3 months)", () => {
        const result: string = calculateDuration("2020-11", "2023-02");
        expect(result).toBe("2 years 3 months");
      });

      it("Start month greater than end month (1 month case)", () => {
        const result: string = calculateDuration("2019-12", "2021-01");
        expect(result).toBe("1 year 1 month");
      });
    });
  });
});
