const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        //main: './web/index.js'
        LikeInjector: './web/LikeInjector.js',
        LikeModule: './web/LikeModule.js',
        //vendors: ['react']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'public', to: '.' }
            ],
        }),
    ]
}
