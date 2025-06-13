import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllWorkExperiences, getWorkExperienceYears } from "@/utils/resume";
import { getCollection } from "astro:content";

vi.mock("astro:content", () => ({
	getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockResumeCollectionEntries = [
	{
		id: "ineco",
		collection: "resume" as const,
		data: {
			company: "Ineco",
			company_url: "https://www.ineco.com/ineco/",
			startup: false,
			location: "Madrid, Spain",
			position: "Senior Front-end Developer",
			start_date: "July. 2024",
			end_date: "Present",
			description: "Current position description",
			responsibilities: ["Current responsibility 1", "Current responsibility 2"],
		},
	},
	{
		id: "deutsche-bank",
		collection: "resume" as const,
		data: {
			company: "Deutsche Bank",
			company_url: "https://www.deutsche-bank.es/",
			startup: false,
			location: "Madrid, Spain",
			position: "Tech Lead",
			start_date: "Jun. 2021",
			end_date: "Apr. 2024",
			description: "Previous position description",
			responsibilities: ["Previous responsibility 1", "Previous responsibility 2"],
		},
	},
	{
		id: "telecoming",
		collection: "resume" as const,
		data: {
			company: "Telecoming",
			company_url: "https://www.telecoming.com/",
			startup: false,
			location: "Madrid, Spain",
			position: "Frontend Developer",
			start_date: "Sep. 2014",
			end_date: "Oct. 2015",
			description: "Older position description",
			responsibilities: ["Older responsibility 1", "Older responsibility 2"],
		},
	},
];

describe("resumeUtils", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetCollection.mockResolvedValue(mockResumeCollectionEntries);
	});

	describe("getAllWorkExperiences", () => {
		it("should return all work experiences sorted by start date (newest first) by default", async () => {
			const result = await getAllWorkExperiences();

			expect(result).toHaveLength(3);
			expect(result[0].company).toBe("Ineco");
			expect(result[1].company).toBe("Deutsche Bank");
			expect(result[2].company).toBe("Telecoming");
			expect(result[0].start_date).toBe("July. 2024");
			expect(result[1].start_date).toBe("Jun. 2021");
			expect(result[2].start_date).toBe("Sep. 2014");
		});

		it("should return unsorted work experiences when sorted is false", async () => {
			const result = await getAllWorkExperiences(false);

			expect(result).toHaveLength(3);
			expect(result[0].company).toBe("Ineco");
			expect(result[1].company).toBe("Deutsche Bank");
			expect(result[2].company).toBe("Telecoming");
		});

		it("should return empty array when no work experiences exist", async () => {
			mockGetCollection.mockResolvedValue([]);

			const result = await getAllWorkExperiences();

			expect(result).toEqual([]);
		});

		it("should handle collection with single work experience", async () => {
			const singleExperience = [mockResumeCollectionEntries[0]];
			mockGetCollection.mockResolvedValue(singleExperience);

			const result = await getAllWorkExperiences();

			expect(result).toHaveLength(1);
			expect(result[0].company).toBe("Ineco");
		});

		it("should propagate getCollection errors", async () => {
			mockGetCollection.mockRejectedValue(new Error("Collection error"));

			await expect(getAllWorkExperiences()).rejects.toThrow("Collection error");
		});
	});

	describe("getWorkExperienceYears", () => {
		it("should return correct start and end years from work experiences", async () => {
			const result = await getWorkExperienceYears();

			expect(result.start).toBe("Sep. 2014");
			expect(result.end).toBe("Present");
		});

		it("should return empty strings when no work experiences exist", async () => {
			mockGetCollection.mockResolvedValue([]);

			const result = await getWorkExperienceYears();

			expect(result).toEqual({ start: "", end: "" });
		});

		it("should handle single work experience correctly", async () => {
			const singleExperience = [mockResumeCollectionEntries[1]];
			mockGetCollection.mockResolvedValue(singleExperience);

			const result = await getWorkExperienceYears();

			expect(result.start).toBe("Jun. 2021");
			expect(result.end).toBe("Apr. 2024");
		});

		it("should propagate getCollection errors", async () => {
			mockGetCollection.mockRejectedValue(new Error("Network error"));

			await expect(getWorkExperienceYears()).rejects.toThrow("Network error");
		});
	});
});

describe("resumeUtils - Extended Tests", () => {
	describe("getAllWorkExperiences - Edge Cases", () => {
		it("should handle work experiences with same start dates", async () => {
			const mockSameDateExperiences = [
				{
					id: "company-a",
					collection: "resume" as const,
					data: {
						company: "Company A",
						position: "Developer A",
						start_date: "Jan. 2020",
						end_date: "Dec. 2020",
						description: "Description A",
						responsibilities: ["Task A"],
						startup: false,
						location: "Madrid, Spain",
					},
				},
				{
					id: "company-b",
					collection: "resume" as const,
					data: {
						company: "Company B",
						position: "Developer B",
						start_date: "Jan. 2020",
						end_date: "Jun. 2020",
						description: "Description B",
						responsibilities: ["Task B"],
						startup: false,
						location: "Madrid, Spain",
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockSameDateExperiences);
			const result = await getAllWorkExperiences();

			expect(result).toHaveLength(2);
			expect(result[0].start_date).toBe("Jan. 2020");
			expect(result[1].start_date).toBe("Jan. 2020");
		});

		it("should handle invalid date formats gracefully", async () => {
			const mockInvalidDateExperiences = [
				{
					id: "valid-company",
					collection: "resume" as const,
					data: {
						company: "Valid Company",
						position: "Valid Position",
						start_date: "Jan. 2020",
						end_date: "Dec. 2020",
						description: "Valid description",
						responsibilities: ["Valid task"],
						startup: false,
						location: "Madrid, Spain",
					},
				},
				{
					id: "invalid-company",
					collection: "resume" as const,
					data: {
						company: "Invalid Company",
						position: "Invalid Position",
						start_date: "invalid-date",
						end_date: "another-invalid-date",
						description: "Invalid description",
						responsibilities: ["Invalid task"],
						startup: false,
						location: "Madrid, Spain",
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockInvalidDateExperiences);
			const result = await getAllWorkExperiences();

			expect(result).toHaveLength(2);
		});

		it("should handle work experiences spanning multiple decades", async () => {
			const mockMultiDecadeExperiences = [
				{
					id: "modern-company",
					collection: "resume" as const,
					data: {
						company: "Modern Company",
						position: "Senior Developer",
						start_date: "Jan. 2020",
						end_date: "Present",
						description: "Modern role",
						responsibilities: ["Modern task"],
						startup: false,
						location: "Madrid, Spain",
					},
				},
				{
					id: "old-company",
					collection: "resume" as const,
					data: {
						company: "Old Company",
						position: "Junior Developer",
						start_date: "Jun. 1999",
						end_date: "Dec. 1999",
						description: "Y2K era role",
						responsibilities: ["Legacy task"],
						startup: false,
						location: "Madrid, Spain",
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockMultiDecadeExperiences);
			const result = await getAllWorkExperiences();

			expect(result).toHaveLength(2);
			expect(result[0].company).toBe("Modern Company");
			expect(result[1].company).toBe("Old Company");
		});

		it("should maintain all work experience properties", async () => {
			const result = await getAllWorkExperiences();

			for (const experience of result) {
				expect(experience).toHaveProperty("company");
				expect(experience).toHaveProperty("position");
				expect(experience).toHaveProperty("start_date");
				expect(experience).toHaveProperty("end_date");
				expect(experience).toHaveProperty("description");
				expect(experience).toHaveProperty("responsibilities");
				expect(Array.isArray(experience.responsibilities)).toBe(true);
			}
		});

		it("should handle optional properties correctly", async () => {
			const mockWithOptionalProps = [
				{
					id: "full-props",
					collection: "resume" as const,
					data: {
						company: "Full Props Company",
						company_url: "https://example.com",
						website: "https://example.com",
						location: "Madrid, Spain",
						position: "Developer",
						start_date: "Jan. 2020",
						end_date: "Dec. 2020",
						description: "Full props",
						responsibilities: ["Task"],
						startup: true,
					},
				},
				{
					id: "minimal-props",
					collection: "resume" as const,
					data: {
						company: "Minimal Company",
						position: "Developer",
						start_date: "Jun. 2020",
						end_date: "Dec. 2020",
						description: "Minimal props",
						responsibilities: ["Task"],
						startup: false,
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockWithOptionalProps);
			const result = await getAllWorkExperiences();

			expect(result).toHaveLength(2);
			// Check that the first item (sorted by date) has optional properties
			const fullPropsItem = result.find((exp) => exp.company === "Full Props Company");
			const minimalPropsItem = result.find((exp) => exp.company === "Minimal Company");

			expect(fullPropsItem?.company_url).toBe("https://example.com");
			expect(fullPropsItem?.location).toBe("Madrid, Spain");
			expect(minimalPropsItem?.company_url).toBeUndefined();
			expect(minimalPropsItem?.location).toBeUndefined();
		});
	});

	describe("getWorkExperienceYears - Edge Cases", () => {
		it("should handle work experiences with mixed date formats", async () => {
			const mockMixedDateFormats = [
				{
					id: "recent",
					collection: "resume" as const,
					data: {
						company: "Recent Company",
						position: "Recent Position",
						start_date: "2024-01-01",
						end_date: "Present",
						description: "Recent",
						responsibilities: ["Recent task"],
						startup: false,
					},
				},
				{
					id: "old",
					collection: "resume" as const,
					data: {
						company: "Old Company",
						position: "Old Position",
						start_date: "Jan. 2000",
						end_date: "Dec. 2000",
						description: "Old",
						responsibilities: ["Old task"],
						startup: false,
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockMixedDateFormats);
			const result = await getWorkExperienceYears();

			expect(result.start).toBe("Jan. 2000");
			expect(result.end).toBe("Present");
		});

		it("should sort correctly before extracting years", async () => {
			const mockUnsortedExperiences = [
				{
					id: "middle",
					collection: "resume" as const,
					data: {
						company: "Middle Company",
						position: "Middle Position",
						start_date: "Jun. 2020",
						end_date: "Dec. 2020",
						description: "Middle",
						responsibilities: ["Middle task"],
						startup: false,
					},
				},
				{
					id: "latest",
					collection: "resume" as const,
					data: {
						company: "Latest Company",
						position: "Latest Position",
						start_date: "Jan. 2024",
						end_date: "Present",
						description: "Latest",
						responsibilities: ["Latest task"],
						startup: false,
					},
				},
				{
					id: "earliest",
					collection: "resume" as const,
					data: {
						company: "Earliest Company",
						position: "Earliest Position",
						start_date: "Jan. 2010",
						end_date: "Dec. 2010",
						description: "Earliest",
						responsibilities: ["Earliest task"],
						startup: false,
					},
				},
			];

			mockGetCollection.mockResolvedValue(mockUnsortedExperiences);
			const result = await getWorkExperienceYears();

			expect(result.start).toBe("Jan. 2010");
			expect(result.end).toBe("Present");
		});
	});

	describe("Error Handling", () => {
		it("should propagate collection errors in getAllWorkExperiences", async () => {
			mockGetCollection.mockRejectedValue(new Error("Database connection failed"));

			await expect(getAllWorkExperiences()).rejects.toThrow("Database connection failed");
		});

		it("should propagate collection errors in getWorkExperienceYears", async () => {
			mockGetCollection.mockRejectedValue(new Error("Permission denied"));

			await expect(getWorkExperienceYears()).rejects.toThrow("Permission denied");
		});

		it("should handle empty collection gracefully", async () => {
			mockGetCollection.mockResolvedValue([]);

			const workExperiences = await getAllWorkExperiences();
			const years = await getWorkExperienceYears();

			expect(workExperiences).toEqual([]);
			expect(years).toEqual({ start: "", end: "" });
		});
	});
});
