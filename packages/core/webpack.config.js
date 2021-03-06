const path = require("path");
const webpack = require("webpack");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const pkg = require("./package.json");

const bannerText = `Copyright 2013 Google, Inc.
Copyright 2015 Trim-marks Inc.
Copyright 2018 Vivliostyle Foundation

Vivliostyle.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Vivliostyle.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Vivliostyle.js.  If not, see <http://www.gnu.org/licenses/>.

Vivliostyle core ${pkg.version}`;

const isProduction = process.env.NODE_ENV === "production";

const config = (outputFilename, tsConfigName) => ({
  mode: isProduction ? "production" : "development",
  entry: "./src/vivliostyle.ts",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "browser"),
    filename: isProduction
      ? outputFilename + ".production.js" // "production" or "debug"
      : outputFilename + ".development.js", // "development"
    library: "Vivliostyle",
    libraryTarget: "umd",
    libraryExport: "",
  },
  resolve: {
    extensions: [".js", ".mjs", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: tsConfigName,
              experimentalWatchApi: false,
            },
          },
        ],
      },
      {
        test: /\.(css|txt|xml)$/,
        use: "raw-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VIVLIOSTYLE_DEBUG: JSON.stringify(!isProduction),
    }),
    new webpack.BannerPlugin({
      banner: bannerText,
    }),
    new CircularDependencyPlugin({
      failOnError: true,
      allowAsyncCycles: true,
    }),
  ],
  optimization: {
    minimizer: isProduction ? [new TerserPlugin()] : [],
  },
});

const targets = [config("vivliostyle", "tsconfig.json")];

module.exports = targets;
