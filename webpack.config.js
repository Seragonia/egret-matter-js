const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: '.',
        host:'0.0.0.0'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '.')
    }
};