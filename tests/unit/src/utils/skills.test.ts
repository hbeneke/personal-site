import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllSkills } from "@/utils/skills";
import { getCollection } from "astro:content";
import { clearCache } from "@/utils/cache";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

const mockSkillsCollectionEntries = [
  {
    id: "backend",
    collection: "skills" as const,
    data: {
      name: "Backend",
      perks: ["PHP", "Python", "Symfony", "Laravel", "Node.js"],
    },
  },
  {
    id: "frontend",
    collection: "skills" as const,
    data: {
      name: "Frontend",
      perks: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript"],
    },
  },
  {
    id: "databases",
    collection: "skills" as const,
    data: {
      name: "Databases",
      perks: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
    },
  },
  {
    id: "languages",
    collection: "skills" as const,
    data: {
      name: "Languages",
      perks: ["First Certificate in English (B2), Cambridge College. Native Spanish speaker."],
    },
  },
  {
    id: "tools",
    collection: "skills" as const,
    data: {
      name: "Tools",
      perks: ["Git", "Docker", "VS Code", "PhpStorm"],
    },
  },
];

const mockSkillsWithoutPerks = [
  {
    id: "soft-skills",
    collection: "skills" as const,
    data: {
      name: "Soft Skills",
      perks: [], // perks is required according to schema
    },
  },
  {
    id: "certifications",
    collection: "skills" as const,
    data: {
      name: "Certifications",
      perks: [],
    },
  },
];

const mockEmptySkillsCollection: never[] = [];

describe("Skills Utils functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCache();
  });

  describe("getAllSkills function", () => {
    it("should return all skills when collection has multiple entries", async () => {
      mockGetCollection.mockResolvedValue(mockSkillsCollectionEntries);

      const result = await getAllSkills();

      expect(mockGetCollection).toHaveBeenCalledWith("skills");
      expect(mockGetCollection).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(5);
      expect(result).toEqual([
        {
          name: "Backend",
          perks: ["PHP", "Python", "Symfony", "Laravel", "Node.js"],
        },
        {
          name: "Frontend",
          perks: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript"],
        },
        {
          name: "Databases",
          perks: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
        },
        {
          name: "Languages",
          perks: ["First Certificate in English (B2), Cambridge College. Native Spanish speaker."],
        },
        {
          name: "Tools",
          perks: ["Git", "Docker", "VS Code", "PhpStorm"],
        },
      ]);
    });

    it("should return single skill when collection has one entry", async () => {
      const singleSkillEntry = [mockSkillsCollectionEntries[0]];
      mockGetCollection.mockResolvedValue(singleSkillEntry);

      const result = await getAllSkills();

      expect(mockGetCollection).toHaveBeenCalledWith("skills");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "Backend",
        perks: ["PHP", "Python", "Symfony", "Laravel", "Node.js"],
      });
    });

    it("should handle skills with empty perks array", async () => {
      mockGetCollection.mockResolvedValue(mockSkillsWithoutPerks);

      const result = await getAllSkills();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: "Soft Skills",
        perks: [],
      });
      expect(result[1]).toEqual({
        name: "Certifications",
        perks: [],
      });
    });

    it("should handle skills with empty perks array", async () => {
      const skillWithEmptyPerks = [
        {
          id: "empty-skill",
          collection: "skills" as const,
          data: {
            name: "Empty Skill",
            perks: [],
          },
        },
      ];
      mockGetCollection.mockResolvedValue(skillWithEmptyPerks);

      const result = await getAllSkills();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "Empty Skill",
        perks: [],
      });
    });

    it("should handle skills with single perk", async () => {
      const skillWithSinglePerk = [
        {
          id: "single-perk-skill",
          collection: "skills" as const,
          data: {
            name: "Single Perk Skill",
            perks: ["Only one perk"],
          },
        },
      ];
      mockGetCollection.mockResolvedValue(skillWithSinglePerk);

      const result = await getAllSkills();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "Single Perk Skill",
        perks: ["Only one perk"],
      });
    });

    it("should handle skills with very long perk descriptions", async () => {
      const skillWithLongPerk = [
        {
          id: "long-perk-skill",
          collection: "skills" as const,
          data: {
            name: "Long Perk Skill",
            perks: [
              "This is a very long perk description that contains multiple sentences and detailed information about the skill. It might include certifications, years of experience, specific technologies, and other relevant details that demonstrate proficiency in this particular area.",
            ],
          },
        },
      ];
      mockGetCollection.mockResolvedValue(skillWithLongPerk);

      const result = await getAllSkills();

      expect(result).toHaveLength(1);
      expect(result[0].perks).toHaveLength(1);
      expect(result[0].perks?.[0]).toContain("This is a very long perk description");
    });

    it("should preserve the order of skills from the collection", async () => {
      const orderedSkills = [
        mockSkillsCollectionEntries[2], // Databases
        mockSkillsCollectionEntries[0], // Backend
        mockSkillsCollectionEntries[1], // Frontend
      ];
      mockGetCollection.mockResolvedValue(orderedSkills);

      const result = await getAllSkills();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Databases");
      expect(result[1].name).toBe("Backend");
      expect(result[2].name).toBe("Frontend");
    });

    it("should preserve the order of perks within each skill", async () => {
      const skillWithOrderedPerks = [
        {
          id: "ordered-perks-skill",
          collection: "skills" as const,
          data: {
            name: "Ordered Perks Skill",
            perks: ["First perk", "Second perk", "Third perk", "Fourth perk"],
          },
        },
      ];
      mockGetCollection.mockResolvedValue(skillWithOrderedPerks);

      const result = await getAllSkills();

      expect(result[0].perks).toEqual(["First perk", "Second perk", "Third perk", "Fourth perk"]);
    });

    describe("Edge cases", () => {
      it("should return empty array when collection is empty", async () => {
        mockGetCollection.mockResolvedValue(mockEmptySkillsCollection);

        const result = await getAllSkills();

        expect(mockGetCollection).toHaveBeenCalledWith("skills");
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });

      it("should handle getCollection rejection", async () => {
        const errorMessage = "Failed to fetch skills collection";
        mockGetCollection.mockRejectedValue(new Error(errorMessage));

        await expect(getAllSkills()).rejects.toThrow(errorMessage);
        expect(mockGetCollection).toHaveBeenCalledWith("skills");
      });

      it("should handle getCollection network timeout", async () => {
        mockGetCollection.mockRejectedValue(new Error("Network timeout"));

        await expect(getAllSkills()).rejects.toThrow("Network timeout");
      });

      it("should handle skills with special characters in name", async () => {
        const skillWithSpecialChars = [
          {
            id: "special-chars-skill",
            collection: "skills" as const,
            data: {
              name: "C++ & C# Programming",
              perks: ["Advanced Object-Oriented Programming", "Template Meta-programming"],
            },
          },
        ];
        mockGetCollection.mockResolvedValue(skillWithSpecialChars);

        const result = await getAllSkills();

        expect(result[0].name).toBe("C++ & C# Programming");
      });

      it("should handle skills with unicode characters", async () => {
        const skillWithUnicode = [
          {
            id: "unicode-skill",
            collection: "skills" as const,
            data: {
              name: "Languages",
              perks: ["Native Spanish", "English B2", "French beginner"],
            },
          },
        ];
        mockGetCollection.mockResolvedValue(skillWithUnicode);

        const result = await getAllSkills();

        expect(result[0].name).toBe("Languages");
        expect(result[0].perks).toContain("Native Spanish");
        expect(result[0].perks).toContain("English B2");
        expect(result[0].perks).toContain("French beginner");
      });

      it("should handle getCollection rejection", async () => {
        const errorMessage = "Failed to fetch skills collection";
        mockGetCollection.mockRejectedValue(new Error(errorMessage));

        await expect(getAllSkills()).rejects.toThrow(errorMessage);
        expect(mockGetCollection).toHaveBeenCalledWith("skills");
      });

      it("should handle getCollection network timeout", async () => {
        mockGetCollection.mockRejectedValue(new Error("Network timeout"));

        await expect(getAllSkills()).rejects.toThrow("Network timeout");
      });

      it("should handle very large number of skills", async () => {
        const largeSkillsArray = Array.from({ length: 1000 }, (_, index) => ({
          id: `skill-${index}`,
          collection: "skills" as const,
          data: {
            name: `Skill ${index}`,
            perks: [`Perk ${index}-1`, `Perk ${index}-2`],
          },
        }));
        mockGetCollection.mockResolvedValue(largeSkillsArray);

        const result = await getAllSkills();

        expect(result).toHaveLength(1000);
        expect(result[0].name).toBe("Skill 0");
        expect(result[999].name).toBe("Skill 999");
      });
    });
  });
});
