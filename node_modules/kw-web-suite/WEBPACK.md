## Kitware Web Suite

### Webpack usage

Example on how ParaViewWeb used webpack and its loaders.

```js
// webpack.config.js
var path = require('path'),
    webpack = require('webpack'),
    loaders = require('./config/webpack.loaders.js'),
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
    entry: './src/index.js',
    output: {
        path: './dist',
        filename: 'ParaViewWeb.js',
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: "eslint-loader",
            exclude: /node_modules/,
        }],
        loaders: [
            { test: require.resolve("./src/index.js"), loader: "expose?ParaViewWeb" },
        ].concat(loaders),
    },
    resolve: {
        alias: {
            PVWStyle: path.resolve('./style'),
        },
    },
    postcss: [
        require('autoprefixer')({ browsers: ['last 2 versions'] }),
    ],
    eslint: {
        configFile: '.eslintrc',
    },
};
```

```js
// config/webpack.loaders.js
module.exports = [
    {
        test: /\.svg$/,
        loader: 'svg-sprite',
        exclude: /fonts/,
    },{
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=60000&mimetype=application/font-woff',
    },{
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=60000',
        include: /fonts/,
    },{
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
    },{
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style!css!postcss',
    },{
        test: /\.mcss$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss',
    },{
        test: /\.c$/i,
        loader: "shader",
    },{
        test: /\.json$/,
        loader: 'json-loader',
    },{
        test: /\.html$/,
        loader: 'html-loader',
    },{
        test: /\.js$/,
        include: /node_modules\/paraviewweb\//,
        loader: 'babel?presets[]=es2015,presets[]=react',
    },{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015,presets[]=react',
    },
]

```
