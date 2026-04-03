const express = require("express");
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

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => successResponse(res, 200, "Server is healthy"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
