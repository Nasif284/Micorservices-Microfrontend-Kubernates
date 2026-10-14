const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const jwt = require("jsonwebtoken");
const path = require("path");

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../../proto/user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const usersProto = grpc.loadPackageDefinition(packageDefinition).users;

function getMe(call, callback) {
  try {
    const token = call.request.token || (call.metadata.get("authorization")[0] || "").toString().replace(/^Bearer /, "");
    if (!token) return callback({ code: grpc.status.UNAUTHENTICATED, message: "Token required" });
    const user = jwt.verify(token, process.env.JWT_SECRET);
    callback(null, { id: user.id, email: user.email, name: user.name || "", role: user.role });
  } catch (_) {
    callback({ code: grpc.status.UNAUTHENTICATED, message: "Invalid or expired token" });
  }
}

function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(usersProto.UserService.service, { GetMe: getMe });
  const port = process.env.GRPC_PORT || "50051";
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) throw err;
    server.start();
    console.log(`User gRPC listening on ${port}`);
  });
  return server;
}

module.exports = startGrpcServer;
