document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".accordion-toggle");

  for (const button of Array.from(toggleButtons)) {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      if (!targetId) return;

      const content = document.getElementById(targetId);
      const icon = button.querySelector(".accordion-icon");
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      if (content) {
        if (isExpanded) {
          content.classList.add("hidden");
          button.setAttribute("aria-expanded", "false");
          icon?.classList.remove("rotate-180");
        } else {
          content.classList.remove("hidden");
          button.setAttribute("aria-expanded", "true");
          icon?.classList.add("rotate-180");
        }
      }
    });
  }
});
