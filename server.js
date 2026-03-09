const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "contact-inquiries.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "arjuna-backend", timestamp: new Date().toISOString() });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, service, message } = req.body || {};

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
  const phoneIsValid = /^[0-9]{10}$/.test(String(phone || ""));

  if (!name || !service || !message || !emailIsValid || !phoneIsValid) {
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }

  const entry = {
    id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name,
    email,
    phone,
    service,
    message,
    createdAt: new Date().toISOString()
  };

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let existing = [];
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf8");
      existing = raw ? JSON.parse(raw) : [];
    }

    existing.push(entry);
    fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2), "utf8");

    return res.status(201).json({ ok: true, id: entry.id });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Failed to save inquiry" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
