const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => ({
  entry: ['babel-polyfill', './src/index.ts'],
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // path: path.resolve(__dirname, '../fullstack/resources/nodejs/dist'),
    filename: 'index.js',
  },
  ignoreWarnings: [
    {
      module: /node_modules\/express\/lib\/view\.js/,
      message: /the request of a dependency is an expression/,
    },
  ],
  plugins: [
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    }),
  ],
  externals: [nodeExternals()],
});
