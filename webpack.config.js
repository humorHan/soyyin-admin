// webpack.config.js
var vue = require('vue-loader');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

/* 
    发布到线上的版本即生产版本，命令：PRODUCTION=1 webpack --progress 打包压缩，并且注入md5戳
 */
var production = process.env.PRODUCTION;
var plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 20 }),
    new HtmlWebpackPlugin({
        filename: '../main.html',
        template: 'src/template/main.tpl',
        chunks: ['main', 'vender'],
        inject: true,
    }),
    new HtmlWebpackPlugin({
        filename: '../index.html',
        template: 'src/template/index.tpl',
        chunks: ['index'],
        inject: true,
    }),
    new webpack.DefinePlugin({
        PRODUCTION_ENV: production ? true : false,
    }),
];
module.exports = {
    entry: {
        main: './src/main.js',
        index: './src/index.js',
        vender: ['./src/vender/bootstrap-datetimepicker.min.js', './src/vender/bootstrap-datetimepicker.zh-CN.js', './src/vender/bootstrap-datetimepicker.min.css']
    },
    output: {
        path: './release/js',
        publicPath: '/js/',
        filename: production ? '[name].bundle.js?[hash]' : '[name].bundle.js',
        chunkFilename: production ? "chunks/[id].js?[hash]" : "chunks/[id].js",
    },
    plugins: plugins,
    externals: {
        jquery: 'window.$',
    },
    module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue' },
            {
                test: /\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel'
            },
            { test: /\.css$/, loader: "style!css" },
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    devtool: '#source-map',
};