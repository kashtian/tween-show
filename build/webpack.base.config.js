const path = require('path');
const vueConfig = require('./vue-loader.config');

module.exports = {
    entry: {
        app: ['./src/client-entry.js'],
        vendor: [
            'vue',
            'vue-router',
            'vuex',
            'vuex-router-sync'
        ]
    },

    output: {
        path: path.join(process.cwd(), 'dist/static'),
        filename: '[name].[chunkhash:7].js',
        publicPath: '/static/'
    },

    resolve: {
        extensions: ['.js', '.vue']
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[hash:7].[ext]'
                }
            }
        ]
    }
}