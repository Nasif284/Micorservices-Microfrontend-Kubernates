const jwt = require("jsonwebtoken");
function authenticateUnlessPublic(req, res, next) {
  if ((req.path === "/auth/login" || req.path === "/auth/register") && req.method === "POST") return next();
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (_) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
module.exports = authenticateUnlessPublic;
