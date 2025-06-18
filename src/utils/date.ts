export function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = endDate.toLowerCase() === "present" ? new Date() : new Date(endDate);

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
