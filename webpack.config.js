const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['./ts/index.tsx'],
    output: {
        path: path.join(__dirname, '/public'),
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        modules: [
            path.join(__dirname, '/ts'),
            'node_modules'
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            ts: path.join(__dirname, '/ts'),
            less: path.join(__dirname, '/less'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
    },
    devServer: {
        port: 8080,
        historyApiFallback: {
          index: 'index.html'
      },
      disableHostCheck: true
    },
};
