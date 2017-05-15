const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config');

let plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false
    })
]

module.exports = Object.assign({}, baseConfig, {
    target: 'node',
    entry: './src/server-entry.js',
    output: {
        path: path.join(process.cwd(), 'dist/server'),
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals()],
    plugins: process.argv.indexOf('--development') > -1 ? [] : plugins
})