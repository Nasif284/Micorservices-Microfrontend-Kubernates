const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
module.exports = {
  entry: "./src/main.tsx",
  mode: "development",
  devServer: {
    port: 3100,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
  },
  output: {
    publicPath: "auto", clean: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  },
  module: {
    rules: [{
      test: /\.tsx?$/, exclude: /node_modules/, use: "ts-loader"
    }],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        auth: "auth@http://localhost:3001/remoteEntry.js",
        dashboard: "dashboard@http://localhost:3002/remoteEntry.js",
        profile: "profile@http://localhost:3003/remoteEntry.js",
        settings: "settings@http://localhost:3004/remoteEntry.js",
      },
      exposes: {
        "./store": "./src/store/index.ts",
        "./shared": "./src/shared/Shared.tsx",
      },
      shared: {
        react: {
          singleton: true, requiredVersion: deps.react
        },
        "react-dom": {
          singleton: true, requiredVersion: deps["react-dom"]
        },
        "react-redux": {
          singleton: true,
          requiredVersion: deps["react-redux"],
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: deps["react-router-dom"],
        },
        "@reduxjs/toolkit": {
          singleton: true,
          requiredVersion: deps["@reduxjs/toolkit"],
        },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
