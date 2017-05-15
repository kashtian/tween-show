const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config');

let plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false
    })
]

module.exports = Object.assign({}, baseConfig, {
    target: 'node',
    entry: './src/server-entery.js',
    output: {
        path: path.join(process.cwd(), 'dist/server'),
        filename: 'server-bundle.js'
    },
    externals: [nodeExternals()],
    plugins: process.argv.indexOf('--production') > -1 ? plugins : []
})