/**
 * Checks whether a nav link should be highlighted for the current page.
 *
 * The home path ("/") only matches exactly; any other path also matches its
 * sub-routes, so a section link stays highlighted while browsing inside it.
 *
 * @param pathname - Current page pathname, e.g. "/posts/my-article".
 * @param path - Nav link path to test, e.g. "/posts".
 * @returns True when the link points to the current page or section.
 *
 * @example
 * isActivePath("/posts/astro-tips", "/posts"); // true
 * isActivePath("/posts", "/"); // false
 */
export function isActivePath(pathname: string, path: string): boolean {
  return path === "/" ? pathname === path : pathname.startsWith(path);
}
