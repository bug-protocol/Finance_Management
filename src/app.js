const express = require("express");
const path = require("path");
const morgan = require("morgan");
const apiRateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const { successResponse } = require("./utils/apiResponse");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const postmanCollectionPath = path.join(
  __dirname,
  "docs",
  "Finance-Dashboard.postman_collection.json"
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => successResponse(res, 200, "Server is healthy"));
app.get("/docs/postman", (_req, res) => res.sendFile(postmanCollectionPath));
app.get("/api/v1/docs/postman", (_req, res) => res.sendFile(postmanCollectionPath));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
