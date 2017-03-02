## Kitware Web Suite [![Dependency Status](https://img.shields.io/david/kitware/kw-web-suite.svg)](https://david-dm.org/kitware/kw-web-suite)

### Introduction

The **Kitware Web Suite** package aims to provide a common
set of tools used to build Web application at Kitware behind
a single dependency.

Anyone can use it, but the goal is to standardise
the tools and versions used accross our Web projects.

Here is the full list that will be available to you with **kw-web-suite**.

**Caution**:

For npm < 3.x the executable from kw-web-suite will be located underneath kw-web-suite/node_modules
which will prevent your application from properly using them. In order to fix that you can
add the following **postinstall** command in your package.json.

```js
 [...]
 "scripts": {
    "postinstall": "fix-kw-web-suite || true"
    [...]
 }
```

### ES6

Package name        | NPM Version                                                      | Version
------------------- | ---------------------------------------------------------------- | ---------
babel-core          | ![npm version](https://badge.fury.io/js/babel-core.svg)          | 6.17.0
babel-eslint        | ![npm version](https://badge.fury.io/js/babel-eslint.svg)        | 7.0.0
babel-loader        | ![npm version](https://badge.fury.io/js/babel-loader.svg)        | 6.2.5
babel-polyfill      | ![npm version](https://badge.fury.io/js/babel-polyfill.svg)      | 6.16.0
babel-preset-es2015 | ![npm version](https://badge.fury.io/js/babel-preset-es2015.svg) | 6.16.0
babel-preset-react  | ![npm version](https://badge.fury.io/js/babel-preset-react.svg)  | 6.16.0

### ESLint

Package name                   | NPM Version                                                                | Version
------------------------------ | -------------------------------------------------------------------------- | --------
eslint                         | ![npm version](https://badge.fury.io/js/eslint.svg)                        | 3.7.1
eslint-loader                  | ![npm version](https://badge.fury.io/js/eslint-loader.svg)                 | 1.5.0
eslint-config-airbnb           | ![npm version](https://badge.fury.io/js/eslint-config-airbnb.svg)          | 12.0.0
eslint-plugin-react            | ![npm version](https://badge.fury.io/js/eslint-plugin-react.svg)           | 6.3.0
eslint-plugin-import           | ![npm version](https://badge.fury.io/js/eslint-plugin-import.svg)          | 1.16.0
eslint-plugin-jsx-a11y         | ![npm version](https://badge.fury.io/js/eslint-plugin-jsx-a11y.svg)        | 2.2.0
eslint-import-resolver-webpack | ![npm version](https://badge.fury.io/js/eslint-import-resolver-webpack.svg)| 0.6.0

### Webpack loaders

Package name         | NPM Version                                                       | Version
-------------------- | ----------------------------------------------------------------- | --------
autoprefixer         | ![npm version](https://badge.fury.io/js/autoprefixer.svg)         | 6.5.0
css-loader           | ![npm version](https://badge.fury.io/js/css-loader.svg)           | 0.25.0
expose-loader        | ![npm version](https://badge.fury.io/js/expose-loader.svg)        | 0.7.1
file-loader          | ![npm version](https://badge.fury.io/js/file-loader.svg)          | 0.9.0
html-loader          | ![npm version](https://badge.fury.io/js/html-loader.svg)          | 0.4.4
json-loader          | ![npm version](https://badge.fury.io/js/json-loader.svg)          | 0.5.4
postcss-loader       | ![npm version](https://badge.fury.io/js/postcss-loader.svg)       | 0.13.0
shader-loader        | ![npm version](https://badge.fury.io/js/shader-loader.svg)        | 1.3.0
string-replace-loader| ![npm version](https://badge.fury.io/js/string-replace-loader.svg)| 1.0.5
style-loader         | ![npm version](https://badge.fury.io/js/style-loader.svg)         | 0.13.1
svg-sprite-loader    | ![npm version](https://badge.fury.io/js/svg-sprite-loader.svg)    | 0.0.29
url-loader           | ![npm version](https://badge.fury.io/js/url-loader.svg)           | 0.5.7

### Webpack plugins

Package name        | NPM Version                                                      | Version
------------------- | ---------------------------------------------------------------- | --------
html-webpack-plugin | ![npm version](https://badge.fury.io/js/html-webpack-plugin.svg) | 2.22.0

### Webpack cli

Package name        | NPM Version                                                     | Version
------------------- | --------------------------------------------------------------- | --------
node-libs-browser   | ![npm version](https://badge.fury.io/js/node-libs-browser.svg)  | 1.0.0
webpack             | ![npm version](https://badge.fury.io/js/webpack.svg)            | 1.13.2
webpack-dev-server  | ![npm version](https://badge.fury.io/js/webpack-dev-server.svg) | 1.15.0

### Software process

Package name              | NPM Version                                                            | Version
------------------------- | ---------------------------------------------------------------------- | --------
commitizen                | ![npm version](https://badge.fury.io/js/commitizen.svg)                | 2.8.6
cz-conventional-changelog | ![npm version](https://badge.fury.io/js/cz-conventional-changelog.svg) | 1.2.0
semantic-release          | ![npm version](https://badge.fury.io/js/semantic-release.svg)          | 4.3.5


### Utilities

Package name  | NPM Version                                          | Version
------------- | ---------------------------------------------------- | --------
shelljs       | ![npm version](https://badge.fury.io/js/shelljs.svg) | 0.7.4
