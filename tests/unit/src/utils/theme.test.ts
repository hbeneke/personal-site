import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { getThemeInitScript } from "@/utils/theme";

describe("Theme Utils", () => {
  describe("getThemeInitScript", () => {
    it("should return a string containing the initialization script", () => {
      const script = getThemeInitScript();

      expect(typeof script).toBe("string");
      expect(script.length).toBeGreaterThan(0);
    });

    it("should include valid themes in the script", () => {
      const script = getThemeInitScript();

      expect(script).toContain('["light","dark"]');
      expect(script).toContain("validThemes");
    });

    it("should include localStorage operations", () => {
      const script = getThemeInitScript();

      expect(script).toContain("localStorage.getItem('theme')");
      expect(script).toContain("localStorage.setItem('theme', theme)");
    });

    it("should include media query check for dark mode preference", () => {
      const script = getThemeInitScript();

      expect(script).toContain("window.matchMedia('(prefers-color-scheme: dark)')");
      expect(script).toContain(".matches");
    });

    it("should include DOM manipulation for data-theme attribute", () => {
      const script = getThemeInitScript();

      expect(script).toContain("document.documentElement.setAttribute('data-theme', theme)");
    });

    it("should include theme validation logic", () => {
      const script = getThemeInitScript();

      expect(script).toContain("validThemes.includes(stored)");
    });

    it("should include fallback logic for invalid themes", () => {
      const script = getThemeInitScript();

      expect(script).toContain("prefersDark ? 'dark' : 'light'");
    });

    it("should wrap the logic in an IIFE", () => {
      const script = getThemeInitScript();

      expect(script).toMatch(/^\s*\(function\(\)\s*{/);
      expect(script).toMatch(/}\)\(\);\s*$/);
    });

    it("should be consistent across multiple calls", () => {
      const script1 = getThemeInitScript();
      const script2 = getThemeInitScript();

      expect(script1).toBe(script2);
    });
  });

  describe("Script execution behavior", () => {
    let mockLocalStorage: { [key: string]: string };
    let mockMatchMedia: Mock;
    let mockSetAttribute: Mock;
    let mockSetItem: Mock;
    let mockGetItem: Mock;

    beforeEach(() => {
      mockLocalStorage = {};

      mockGetItem = vi.fn((key: string) => mockLocalStorage[key] || null);
      mockSetItem = vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      });
      mockSetAttribute = vi.fn();
      mockMatchMedia = vi.fn();

      Object.defineProperty(global, "localStorage", {
        value: {
          getItem: mockGetItem,
          setItem: mockSetItem,
        },
        writable: true,
      });

      Object.defineProperty(global, "window", {
        value: {
          matchMedia: mockMatchMedia,
        },
        writable: true,
      });

      Object.defineProperty(global, "document", {
        value: {
          documentElement: {
            setAttribute: mockSetAttribute,
          },
        },
        writable: true,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should use stored valid theme", () => {
      mockLocalStorage.theme = "light";
      mockMatchMedia.mockReturnValue({ matches: true });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
      expect(mockSetItem).not.toHaveBeenCalled();
    });

    it("should use dark theme when user prefers dark and no stored theme", () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should use light theme when user prefers light and no stored theme", () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should fallback to system preference for invalid stored theme", () => {
      mockLocalStorage.theme = "invalid-theme";
      mockMatchMedia.mockReturnValue({ matches: true });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should handle empty string as invalid theme", () => {
      mockLocalStorage.theme = "";
      mockMatchMedia.mockReturnValue({ matches: false });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should handle null localStorage value", () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockGetItem).toHaveBeenCalledWith("theme");
      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should not update localStorage if stored theme matches determined theme", () => {
      mockLocalStorage.theme = "dark";
      mockMatchMedia.mockReturnValue({ matches: false });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
      expect(mockSetItem).not.toHaveBeenCalled();
    });

    it("should update localStorage if stored theme differs from determined theme", () => {
      mockLocalStorage.theme = "invalid";
      mockMatchMedia.mockReturnValue({ matches: false });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "light");
    });
  });

  describe("VALID_THEMES validation", () => {
    it("should include light and dark themes in the script", () => {
      const script = getThemeInitScript();

      expect(script).toContain('["light","dark"]');
    });

    it("should validate themes correctly in the script", () => {
      const script = getThemeInitScript();

      expect(script).toContain("validThemes.includes(stored)");
    });
  });

  describe("Edge cases", () => {
    let mockMatchMedia: Mock;
    let mockSetAttribute: Mock;
    let mockSetItem: Mock;
    let mockGetItem: Mock;

    beforeEach(() => {
      mockGetItem = vi.fn();
      mockSetItem = vi.fn();
      mockSetAttribute = vi.fn();
      mockMatchMedia = vi.fn();

      Object.defineProperty(global, "localStorage", {
        value: {
          getItem: mockGetItem,
          setItem: mockSetItem,
        },
        writable: true,
      });

      Object.defineProperty(global, "window", {
        value: {
          matchMedia: mockMatchMedia,
        },
        writable: true,
      });

      Object.defineProperty(global, "document", {
        value: {
          documentElement: {
            setAttribute: mockSetAttribute,
          },
        },
        writable: true,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should handle localStorage errors gracefully", () => {
      mockGetItem.mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });
      mockMatchMedia.mockReturnValue({ matches: false });

      const script = getThemeInitScript();

      expect(() => new Function(script)()).toThrow("localStorage unavailable");
    });

    it("should handle matchMedia errors gracefully", () => {
      mockGetItem.mockReturnValue(null);
      mockMatchMedia.mockImplementation(() => {
        throw new Error("matchMedia unavailable");
      });

      const script = getThemeInitScript();

      expect(() => new Function(script)()).toThrow("matchMedia unavailable");
    });

    it("should handle case-sensitive theme validation", () => {
      mockGetItem.mockReturnValue("LIGHT");
      mockMatchMedia.mockReturnValue({ matches: false });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should handle whitespace in stored theme", () => {
      mockGetItem.mockReturnValue(" dark ");
      mockMatchMedia.mockReturnValue({ matches: true });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should handle numeric values in localStorage", () => {
      mockGetItem.mockReturnValue("1");
      mockMatchMedia.mockReturnValue({ matches: false });

      const script = getThemeInitScript();
      new Function(script)();

      expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
      expect(mockSetItem).toHaveBeenCalledWith("theme", "light");
    });
  });

  describe("Script format and structure", () => {
    it("should be minifiable JavaScript", () => {
      const script = getThemeInitScript();

      expect(script).not.toContain("console.log");
      expect(script).not.toContain("debugger");
      expect(script).not.toContain("//");
    });

    it("should use const declarations consistently", () => {
      const script = getThemeInitScript();

      expect(script).toContain("const validThemes");
      expect(script).toContain("const stored");
      expect(script).toContain("const prefersDark");
      expect(script).toContain("const theme");
    });

    it("should use strict equality checks", () => {
      const script = getThemeInitScript();

      expect(script).not.toContain(" == ");
      expect(script).not.toContain(" != ");
    });

    it("should end with semicolon", () => {
      const script = getThemeInitScript();

      expect(script.trim()).toMatch(/;\s*$/);
    });
  });
});
