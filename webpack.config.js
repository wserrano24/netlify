const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { VueLoaderPlugin } = require("vue-loader");
const Dotenv = require('dotenv-webpack');


const path = require('path');
const NAME = "mfeDashboard";
const FILENAME = "remoteEntry.js"
const PORT = 8090;

var config = {
  output: {
    publicPath: "https://advance-front.apibaz.com/pfi-bkm-mfe-lap-dashboard-v1/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".vue", ".jsx", ".js", ".json"],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    }
  },

  devServer: {
    port: PORT,
    historyApiFallback: true,
    hot: true
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ["\\.vue$"],
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: NAME,
      filename: FILENAME,
      remotes: {},
      exposes: {
        "./Dashboard": "./src/pages/dashboard/index.vue"
      },
      shared: require("./package.json").dependencies,
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv()
  ],
}

module.exports = (_, argv) => {
  if (argv.mode === 'development') {
    config.output.publicPath="http://localhost:"+PORT+"/";
    config.plugins[3] = new Dotenv({
      path: './.env.dev'
  })
  }
  return config;
};