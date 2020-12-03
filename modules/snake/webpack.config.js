const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv-webpack');

module.exports = env => {
    return {
        mode: "development",
        entry: "./src/index.tsx",
        output: {
            publicPath: '/',
            filename: '[contenthash].js'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg|jpg|webp|ico)(\?v=\d+\.\d+\.\d+)?$/,
                    use: ["file-loader"]
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",

            }),
            new dotenv({
                path: `.${env.ENVIRONMENT}.env`
            })
        ],
        devServer: {
            historyApiFallback: true
        }
    }
};