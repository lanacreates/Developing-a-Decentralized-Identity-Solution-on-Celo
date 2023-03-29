const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack'); // Add this line
const webpack = require('webpack');
const path = require('path');

module.exports = (env) => {
  return {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      hot: true,
      open: true,
    },
    stats: {
      errorDetails: true
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.IgnorePlugin({ resourceRegExp: /\.js\.map$/ }), // Add a comma here
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '/home/lanacreates/celo-did/client/public/index.html'),
        publicPath: '/',
        inject: 'body',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        templateParameters: {
          'PUBLIC_URL': '/',
        },
      }),
      // Add the EnvironmentPlugin configuration
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      // Add the DefinePlugin configuration
      new DefinePlugin({
        'process.env': JSON.stringify(process.env)
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        fs: require.resolve('browserify/lib/_empty'), // Use browserify's empty shim for 'fs'
        net: require.resolve('browserify/lib/_empty'), // Use browserify's empty shim for 'net'
      },
    },
  };
};
