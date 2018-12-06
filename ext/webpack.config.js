module.exports = {
    mode: 'production',
    entry: './src/entry',

    node:
        {
            fs: "empty"
        },

    module:
        {
            rules: [
                {
                    test: /\.(html)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: "../assets/html",
                                name: '[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: "../assets/img",
                                name: '[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: "../assets/css",
                                name: '[name].[ext]'
                            }
                        }
                    ]
                }
            ],
        },

    optimization:
        {
            // We no not want to minimize our code.
            minimize: false
        },

    output:
        {
            path: __dirname + "/chrome/scripts",
        },

    target: "web"
}