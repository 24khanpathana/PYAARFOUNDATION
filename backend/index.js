const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Admin = require("./models/Admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Initial Admin Creation (Run Once) ---
// This function creates the first admin user from your .env file.
// UNCOMMENT it, run the server once, then COMMENT it out again.

const createAdmin = async () => {
  try {
    const adminId = process.env.ADMIN_ID || "amaanp2710@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "amaan@team";
    const adminExists = await Admin.findOne({ adminId });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const newAdmin = new Admin({
        adminId,
        password: hashedPassword,
      });

      await newAdmin.save();
      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    createAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// ... [Keep everything above the routes exactly the same] ...

// --- API Routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));
app.use("/api/forms", require("./routes/formRoutes")); // <-- New
app.use("/api/settings", require("./routes/settingRoutes"));
// Add this under your other API Routes in server.js
app.use("/api/animals", require("./routes/animalRoutes"));
app.use("/api/sponsors", require("./routes/sponsorRoutes"));
app.use("/api/audit-requests", require("./routes/auditRequestRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use. Stop the existing Node server on this port or start this backend with a different PORT value.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
