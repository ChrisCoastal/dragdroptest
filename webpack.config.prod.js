const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  // tells webpack this is being built for development (it does fewer optimizations; easier to debug)
  mode: 'production',
  // where does the project start from (root script)
  devServer: {
    static: {
      directory: path.join(__dirname, './'),
    },
  },
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    // path requires an absolute path
    path: path.resolve(__dirname, 'dist'),
  },
  // devtools tells webpack that there is a sourcemap already
  devtool: 'inline-source-map',
  module: {
    // use loaders to tell webpack how to deal with different files
    rules: [
      {
        // use regex to have webpack find any .ts file
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // plugin telling webpack to clear output folder before adding anything
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
