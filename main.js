(function () {
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const counter = entry.target;
          const target = Number(counter.getAttribute("data-count"));
          if (!Number.isFinite(target) || target <= 0) {
            observer.unobserve(counter);
            return;
          }

          let current = 0;
          const step = Math.ceil(target / 40);
          const suffix = counter.getAttribute("data-suffix") || "";
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.textContent = `${target}${suffix}`;
              clearInterval(timer);
            } else {
              counter.textContent = `${current}`;
            }
          }, 25);

          observer.unobserve(counter);
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }
})();
