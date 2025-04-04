const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  // ...existing config...
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  plugins: [
    // ...existing plugins...
    new ReactRefreshWebpackPlugin(),
  ],
};