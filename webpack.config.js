const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const  outputDirectory = "dist";

module.exports  = {
  entry:[
    "./src/client/index.js",
    "./src/client/style.css"
  ],
  output:{
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
    publicPath: "/"
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:{
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer:{
    contentBase: path.join(__dirname, "dist"),
    port:3000,
    open:true,
    proxy:{
      "/api":"http://localhost:8080"
    },
    historyApiFallback: true

  },
  plugins:[
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, "src/client"), "node_modules"]
  }
}