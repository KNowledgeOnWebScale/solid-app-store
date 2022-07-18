const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        index: path.resolve(__dirname, './js/index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname),
    },
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
