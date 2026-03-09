const form = document.getElementById("contactForm");
const statusElement = document.getElementById("formStatus");

function isFirebaseReady(firebaseOptions) {
  if (!firebaseOptions || !firebaseOptions.enabled) {
    return false;
  }

  const config = firebaseOptions.config || {};
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

async function submitToFirebase(data) {
  const firebaseOptions = window.SITE_CONFIG && window.SITE_CONFIG.firebase;
  if (!isFirebaseReady(firebaseOptions)) {
    return false;
  }

  if (typeof firebase === "undefined") {
    throw new Error("Firebase SDK not loaded");
  }

  const existingApp = firebase.apps && firebase.apps.length > 0 ? firebase.apps[0] : null;
  const app = existingApp || firebase.initializeApp(firebaseOptions.config);
  const db = app.firestore();
  const collectionName = firebaseOptions.collectionName || "contact_inquiries";

  await db.collection(collectionName).add({
    ...data,
    createdAt: new Date().toISOString(),
    source: "website-contact-form"
  });

  return true;
}

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

    try {
      const sentToFirebase = await submitToFirebase(data);
      if (sentToFirebase) {
        statusElement.textContent = "Thanks! Your inquiry has been submitted to Firebase.";
        statusElement.style.color = "#0f766e";
        form.reset();
        return;
      }
    } catch (error) {
      statusElement.textContent = "Firebase submission failed. Trying backup route...";
      statusElement.style.color = "#b45309";
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
