const form = document.getElementById("contactForm");
const statusElement = document.getElementById("formStatus");

if (form && statusElement) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || ""));
    const phoneIsValid = /^[0-9]{10}$/.test(String(data.phone || ""));

    if (!data.name || !data.service || !data.message || !emailIsValid || !phoneIsValid) {
      statusElement.textContent = "Please complete all fields with valid details.";
      statusElement.style.color = "#b91c1c";
      return;
    }

    const backendUrl = window.SITE_CONFIG && window.SITE_CONFIG.contactApiUrl;

    if (backendUrl) {
      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        statusElement.textContent = "Thanks! Your inquiry has been submitted.";
        statusElement.style.color = "#0f766e";
        form.reset();
        return;
      } catch (error) {
        statusElement.textContent = "Submission failed. Please use WhatsApp or call us directly.";
        statusElement.style.color = "#b91c1c";
        return;
      }
    }

    statusElement.textContent = "Thanks! Frontend is ready. Connect backend API in site-config.js when you are ready.";
    statusElement.style.color = "#0f766e";
    form.reset();
  });
}
