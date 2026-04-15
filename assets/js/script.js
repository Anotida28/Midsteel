const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const quoteForm = document.getElementById("quote-form");
const formNote = document.getElementById("form-note");
const revealItems = document.querySelectorAll(".reveal");
const yearTarget = document.getElementById("year");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  const setMenuState = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    setMenuState(false);
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    setMenuState(isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (!siteNav.contains(target) && !menuToggle.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  setMenuState(document.body.classList.contains("nav-open"));
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = (formData.get("name") || "").toString().trim();
    const company = (formData.get("company") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const product = (formData.get("product") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const lines = [
      "Hello Midsteel, I would like to request a quote.",
      `Name: ${name}`,
      company ? `Company: ${company}` : "",
      `Phone: ${phone}`,
      `Product: ${product}`,
      message ? `Project details: ${message}` : "",
    ].filter(Boolean);

    const url = `https://wa.me/263773219487?text=${encodeURIComponent(lines.join("\n"))}`;

    if (formNote) {
      formNote.textContent = "Opening WhatsApp with your request...";
    }

    const popup = window.open(url, "_blank", "noopener");

    if (!popup) {
      window.location.href = url;
    }
  });
}
