require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("./middleware/auth");
const { getMe } = require("./grpc/userClient");
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.get("/health", (_req, res) => res.json({ service: "order-service", status: "ok" }));
app.use("/orders", authenticate);

app.post("/orders", async (req, res, next) => {
  try {
    const { item, quantity, price } = req.body;
    if (!item || !Number.isInteger(quantity) || quantity < 1 || typeof price !== "number" || price < 0) {
      return res.status(400).json({
        message: "item, positive integer quantity, and non-negative numeric price are required",
      });
    }
    const order = await prisma.order.create({ data: { userId: req.user.id, item, quantity, price } });
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

app.get("/orders", async (req, res, next) => {
  try {
    res.json({
      orders: await prisma.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      }),
    });
  } catch (err) {
    next(err);
  }
});

app.get("/orders/:id", async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

app.patch("/orders/:id", async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    let actor = req.user;
    if (req.user.role === "admin") {
      try {
        actor = await getMe(req.token);
      } catch (_) {
        return res.status(403).json({ message: "Admin role verification failed" });
      }
    }
    const isOwner = order.userId === actor.id;
    if (!isOwner && actor.role !== "admin") {
      return res.status(403).json({ message: "Only the owner or an admin can update this order" });
    }
    const data = {};
    if (req.body.item !== undefined) data.item = req.body.item;
    if (req.body.quantity !== undefined) {
      if (!Number.isInteger(req.body.quantity) || req.body.quantity < 1) return res.status(400).json({ message: "quantity must be a positive integer" });
      data.quantity = req.body.quantity;
    }
    if (req.body.price !== undefined) {
      if (typeof req.body.price !== "number" || req.body.price < 0) return res.status(400).json({ message: "price must be a non-negative number" });
      data.price = req.body.price;
    }
    if (req.body.status !== undefined) {
      if (actor.role !== "admin") return res.status(403).json({ message: "Only admins can change status" });
      if (!["pending", "processing", "shipped", "delivered"].includes(req.body.status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }
      data.status = req.body.status;
    }
    res.json({ order: await prisma.order.update({ where: { id: order.id }, data }) });
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = { app, prisma };
