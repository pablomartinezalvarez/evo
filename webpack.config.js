const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: 'index.html',
    filename: 'index.html',
    inject: true,
});

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.tsx?$/,
                loaders: ['babel-loader', 'ts-loader'],
                exclude: '/node_modules/'
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.html'],
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: dev ? 'development' : 'production',
    plugins: dev
        ? [HTMLWebpackPluginConfig, new webpack.HotModuleReplacementPlugin()]
        : [HTMLWebpackPluginConfig],
};