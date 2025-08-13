const VALID_THEMES = ["light", "dark"] as const;

export const getThemeInitScript = (): string => `
(function() {
  const validThemes = ${JSON.stringify(VALID_THEMES)};
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = validThemes.includes(stored) 
    ? stored 
    : prefersDark ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', theme);
  if (stored !== theme) localStorage.setItem('theme', theme);
})();
`;
