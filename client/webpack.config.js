const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      fs: require.resolve("fs"),
    },
  },
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [process.env.NODE_ENV === "production" ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"],
      },
      { test: /\.handlebars$/, loader: "handlebars-loader" },
      {
        test: /\.png$/,
        loader: "file-loader",
        options: {
          publicPath: "./dist/",
          name: "[name].[ext]?[hash]",
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new webpack.BannerPlugin({
      banner: `
			Build Data : ${new Date().toLocaleDateString()}
			Author : ${childProcess.execSync("git config user.name")}
			`,
    }),
    new webpack.DefinePlugin({
      TWO: "1+1",
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "procution"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    ...(process.env.NODE_ENV === "production" ? [new MiniCssExtractPlugin({ filename: `[name].css` })] : []),
  ],
};
