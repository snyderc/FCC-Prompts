// need to provide: entry point & output point

// path key below must have absolute path
// not relative path.
// __dirname gives current directory
// path.join to concatenate multiple paths
// so there aren't edge case issues

const path = require('path');

// "devtool" allows various attributes
// including a source map
// that helps you figure out
// which JS file has the error
// instead of just giving the reference to bundle.js.
// 'cheap-module-eval-source-map'

// "yarn run dev-server" from the terminal
// (I forget where this is defined...)

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        },
        {
            test: /\.s?css$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public')
    }
};
