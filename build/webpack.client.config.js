const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const HTMLPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const vueConfig = require('./vue-loader.config');

if (process.argv.indexOf('--production') < 0) {
    /**
     * 开发环境配置热替换
     */
    baseConfig.entry.app.push('webpack-hot-middleware/client');
} else {
    vueConfig.loaders = {
        less: ExtractTextPlugin.extract({
            use: 'css-loader!less-loader',
            fallback: 'vue-style-loader'
        })
    }
}

const devConfig = {
    devtool: '#source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //跳过编译中出错的模块
        new webpack.NoEmitOnErrorsPlugin(),
        new HTMLPlugin({
            template: 'src/index.template.html'
        })
    ]
};

const prodConfig = {
    plugins: [
        //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false
        }),
        // extract vendor chunks for better caching
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new HTMLPlugin({
            template: 'src/index.template.html'
        }),
        new ExtractTextPlugin('[name].[contenthash:7].css')
    ]
}

module.exports = Object.assign({}, baseConfig, process.argv.indexOf('--production') > -1 ? prodConfig : devConfig);

