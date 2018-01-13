var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

// var nodeModules = {};
// fs.readdirSync('node_modules')
//     .filter(function (x) {
//         return ['.bin'].indexOf(x) === -1;
//     })
//     .forEach(function (mod) {
//         nodeModules[mod] = 'commonjs ' + mod;
//     });

module.exports = {
    entry: ['babel-polyfill', './src/server.mjs'],
    target: 'node',
    output: {
        path: __dirname,
        filename: 'index.js'
    },
    // externals: nodeModules
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /.js?$/,
                query: {
                    presets: ["es2015","es2017"],
                    plugins: ['syntax-async-functions']
                }
            }
        ]
    },
};