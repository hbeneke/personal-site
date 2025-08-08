import { describe, it, expect } from "vitest";
import { menuLinks, siteConfig } from "@/site.config";

describe("menuLinks", () => {
  it("should export an array of MenuLink objects", () => {
    expect(Array.isArray(menuLinks)).toBe(true);
    expect(menuLinks.length).toBeGreaterThan(0);
  });

  it("should have the correct menu items", () => {
    const expectedPaths = ["/", "/posts/", "/portfolio/", "/resume/"];

    const expectedTitles = ["Home", "Blog", "Portfolio", "Resume"];

    expect(menuLinks.length).toBe(expectedPaths.length);

    for (let i = 0; i < menuLinks.length; i++) {
      const link = menuLinks[i];
      expect(link).toHaveProperty("path");
      expect(link).toHaveProperty("title");
      expect(link.path).toBe(expectedPaths[i]);
      expect(link.title).toBe(expectedTitles[i]);
    }
  });
});

describe("siteConfig", () => {
  it("should export a SiteConfig object with all required properties", () => {
    const requiredProperties = [
      "authorName",
      "nickname",
      "obfuscatedEmail",
      "jobTitle",
      "siteTitle",
      "siteCreationYear",
      "socialLinks",
      "copyrightYear",
    ];

    for (const prop of requiredProperties) {
      expect(siteConfig).toHaveProperty(prop);
    }
  });

  it("should have correct author information", () => {
    expect(siteConfig.authorName).toBe("Enrique Quero");
    expect(siteConfig.nickname).toBe("Habakuk Beneke");
    expect(siteConfig.obfuscatedEmail).toBe("habakukbeneke [at] proton [dot] me");
    expect(siteConfig.jobTitle).toBe("Frontend Developer");
  });

  it("should have correct site information", () => {
    expect(siteConfig.siteTitle).toBe("Enrique Quero's Resume");
    expect(siteConfig.siteCreationYear).toBe("2024");
  });

  it("should have all required social links", () => {
    expect(siteConfig.socialLinks).toHaveProperty("linkedin");
    expect(siteConfig.socialLinks).toHaveProperty("github");
    expect(siteConfig.socialLinks).toHaveProperty("x");

    expect(siteConfig.socialLinks.linkedin).toContain("linkedin.com");
    expect(siteConfig.socialLinks.github).toContain("github.com");
    expect(siteConfig.socialLinks.x).toContain("x.com");
  });

  it("should calculate copyrightYear correctly", () => {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const expectedCopyrightYear = `2024-${currentYear}`;

    expect(siteConfig.copyrightYear).toBe(expectedCopyrightYear);
  });
});
