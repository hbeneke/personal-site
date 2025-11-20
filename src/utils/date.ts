/**
 * Checks if a date string or Date object is valid
 * @param date - Date string or Date object to validate
 * @returns true if the date is valid, false otherwise
 */
export function isValidDate(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj instanceof Date && !Number.isNaN(dateObj.getTime());
}

/**
 * Calculates the duration between two dates in years and months
 * @param startDate - Start date string
 * @param endDate - End date string or "present"
 * @returns Formatted duration string (e.g., "2 years 3 months")
 * @throws Error if dates are invalid
 */
export function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);

  if (!isValidDate(start)) {
    throw new Error(`Invalid start date: ${startDate}`);
  }

  const end = endDate.toLowerCase() === "present" ? new Date() : new Date(endDate);

  if (!isValidDate(end)) {
    throw new Error(`Invalid end date: ${endDate}`);
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const yearText = years === 1 ? "1 year" : years > 1 ? `${years} years` : "";
  const monthText = months === 1 ? "1 month" : months > 1 ? `${months} months` : "";

  return [yearText, monthText].filter(Boolean).join(" ");
}

/**
 * Formats a date string for display
 * @param dateString - Date string to format
 * @returns Formatted date string (e.g., "15 Oct 2023")
 */
export function formatPostDate(dateString: string): string {
  if (!isValidDate(dateString)) {
    return "Invalid date";
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
