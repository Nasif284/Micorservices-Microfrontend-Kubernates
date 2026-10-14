require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");
const startGrpcServer = require("./grpc/server");
const port = process.env.PORT || 4001;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`User service listening on ${port}`));
  startGrpcServer();
}

start().catch((err) => {
  console.error("User service failed to start:", err.message);
  process.exit(1);
});
