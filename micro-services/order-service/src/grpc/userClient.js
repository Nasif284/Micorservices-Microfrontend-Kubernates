const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const def = protoLoader.loadSync(path.join(__dirname, "../../proto/user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const UserService = grpc.loadPackageDefinition(def).users.UserService;

const client = new UserService(process.env.USER_GRPC_URL || "localhost:50051", grpc.credentials.createInsecure());

function getMe(token) {
  return new Promise((resolve, reject) => client.GetMe({ token }, (err, response) => (err ? reject(err) : resolve(response))));
}

module.exports = { getMe };
