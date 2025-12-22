const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".section, .hero, .site-footer").forEach((section) => {
  section.classList.add("fade-in");
  observer.observe(section);
});

const getEmail = (element) => {
  const user = element.dataset.user;
  const domain = element.dataset.domain;
  if (!user || !domain) {
    return null;
  }
  return `${user}@${domain}`;
};

document.querySelectorAll(".email-link[data-user][data-domain]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const email = getEmail(link);
    if (email) {
      link.textContent = email;
      link.href = `mailto:${email}`;
      window.location.href = `mailto:${email}`;
    }
  });
});

const contactForm = document.querySelector(".contact-form[data-user][data-domain]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = getEmail(contactForm);
    if (!email) {
      return;
    }
    const formData = new FormData(contactForm);
    const name = (formData.get("name") || "").toString().trim();
    const senderEmail = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const subject = name ? `Inquiry from ${name}` : "Website inquiry";
    const bodyLines = [
      message,
      "",
      senderEmail ? `Reply to: ${senderEmail}` : "",
    ].filter(Boolean);
    const body = bodyLines.join("\n");
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}
