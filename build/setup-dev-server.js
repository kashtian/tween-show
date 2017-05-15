const path = require('path');
const webpack = require('webpack');
const MFS = require('memory-fs');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.serverEntry.config');

module.exports = function(app, opts) {
    //set dev middleware
    const clientCompiler = webpack(clientConfig);
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        stats: {
            colors: false,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
        }
    });
    app.use(devMiddleware);
    clientCompiler.plugin('done', )
}