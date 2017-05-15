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
    clientCompiler.plugin('done', () => {
        const fs = devMiddleware.fileSystem;
        const filePath = path.join(clientConfig.output.path, 'index.html');
        if(fs.existsSync(filePath)) {
            const indexTpl = fs.readFileSync(filePath, 'utf-8');
            opts.indexUpdated(indexTpl);
        }
    });

    // hot middleware
    app.use(require('webpack-hot-middleware')(clientCompiler));

    // watch and update server renderer
    const serverCompiler = webpack(serverConfig);
    const mfs = new MFS();
    const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename);
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({
        // watch options
    }, (err, stats) => {
        if (err) throw err;
        stats = stats.toJson();
        stats.errors.forEach(err => console.error(err));
        stats.warnings.forEach(err => console.warn(err));
        opts.bundleUpdated(mfs.readFileSync(outputPath, 'utf-8'));
    })
}