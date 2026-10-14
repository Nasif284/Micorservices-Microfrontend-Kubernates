require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authenticateUnlessPublic = require("./middleware/auth");
const app = express();
const port = process.env.PORT || 3000;
app.use(morgan("combined"));
app.use(cors({ origin: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many requests" },
  }),
);
app.get("/health", (_req, res) => res.json({ service: "api-gateway", status: "ok" }));
app.use("/api", authenticateUnlessPublic);
const proxy = (target, servicePath) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => `${servicePath}${path === "/" ? "" : path}`,
    on: {
      error: (err, _req, res) => {
        if (!res.headersSent) res.status(502).json({ message: "Upstream service unavailable", error: err.message });
      },
    },
  });
app.use("/api/auth", proxy(process.env.USER_SERVICE_URL || "http://localhost:4001", "/auth"));
app.use("/api/users", proxy(process.env.USER_SERVICE_URL || "http://localhost:4001", "/users"));
app.use("/api/orders", proxy(process.env.ORDER_SERVICE_URL || "http://localhost:4002", "/orders"));
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.listen(port, () => console.log(`API gateway listening on ${port}`));
