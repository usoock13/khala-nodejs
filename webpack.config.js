module.exports = {
    mode: 'development',
    entry: {
        main: './static/room-r.js'
    },
    output: {
        filename: 'room.js',
        path: __dirname + '/static'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ]
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
        ]
    }
}