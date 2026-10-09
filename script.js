// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// Header border once the page scrolls
const header = document.querySelector(".site-header");
const onScroll = () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Highlight the nav link for the section in view
const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
          if (isActive) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => spy.observe(section));
}

// Email is assembled on click so it isn't sitting in the HTML for scrapers
const getEmail = (element) => {
  const { user, domain } = element.dataset;
  return user && domain ? `${user}@${domain}` : null;
};

document.querySelectorAll(".email-link[data-user][data-domain]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const email = getEmail(link);
    if (!email) return;
    event.preventDefault();
    window.location.href = `mailto:${email}`;
  });
});

// Contact form opens a pre-filled email
const contactForm = document.querySelector(".contact-form[data-user][data-domain]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = getEmail(contactForm);
    if (!email) return;
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const senderEmail = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = name ? `Message from ${name}` : "Message from your website";
    const body = [message, "", senderEmail ? `Reply to: ${senderEmail}` : ""]
      .filter((line, i, all) => line || i < all.length - 1)
      .join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
