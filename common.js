(function () {
  const config = window.SITE_CONFIG || {};

  const phoneElements = document.querySelectorAll("[data-site-phone]");
  const emailElements = document.querySelectorAll("[data-site-email]");
  const phoneLinks = document.querySelectorAll("[data-phone-link]");
  const emailLinks = document.querySelectorAll("[data-email-link]");
  const waLinks = document.querySelectorAll("[data-wa-link]");

  phoneElements.forEach((el) => {
    el.textContent = config.phoneDisplay || "+91 9742377633";
  });

  emailElements.forEach((el) => {
    el.textContent = config.email || "info@arjunlabs.com";
  });

  phoneLinks.forEach((el) => {
    el.setAttribute("href", `tel:+91${config.phoneNational || "9742377633"}`);
  });

  emailLinks.forEach((el) => {
    el.setAttribute("href", `mailto:${config.email || "info@arjunlabs.com"}`);
  });

  waLinks.forEach((el) => {
    const msg = encodeURIComponent(config.whatsappDefaultMessage || "Hi, I need project support.");
    el.setAttribute("href", `https://wa.me/${config.whatsappNumberIntl || "919742377633"}?text=${msg}`);
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("open");
    });
  }
})();
