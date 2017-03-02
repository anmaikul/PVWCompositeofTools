var path = require('path'),
    webpack = require('webpack'),
    loaders = require('./node_modules/paraviewweb/config/webpack.loaders.js'),
    plugins = [];
if(process.env.NODE_ENV === 'production') {
    console.log('==> Production build');
    plugins.push(new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production"),
        },
    }));
}
module.exports = {
  plugins: plugins,
  entry: ['./src/index.js', './node_modules/webpack-dev-server/client?http://127.0.0.1:80'],
  output: {
    path: './dist',
    filename: 'MyWebApp.js',
  },
  module: {
        preLoaders: [{
            test: /\.js$/,
            loader: "eslint-loader",
            exclude: /node_modules/,
        }],
        loaders: [{ test: require.resolve("./src/index.js"), loader: "expose?MyWebApp" },
        ].concat(loaders),

    },
    resolve: {
        alias: {
            PVWStyle: path.resolve('./node_modules/paraviewweb/style'),
        },
    },
    postcss: [
        require('autoprefixer')({ browsers: ['last 2 versions'] }),
    ],
    eslint: {
        configFile: '.eslintrc',
    },
};
