#! /usr/bin/env node

/* eslint-disable */
var shell = require('shelljs'),
    path = require('path');

// Copy packages over
if (shell.test('-d', './node_modules/kw-web-suite/node_modules')) {
    shell.ls('./node_modules/kw-web-suite/node_modules').forEach(function(fileName) {
        if(!shell.test('-e', './node_modules/'+ fileName) && !shell.test('-L', './node_modules/'+ fileName)) {
            shell.ln('-s','./kw-web-suite/node_modules/' + fileName, './node_modules/'+ fileName);
        }
    });

    // Copy links
    shell.mkdir('-p', './node_modules/.bin');
    shell.ls('./node_modules/kw-web-suite/node_modules/.bin').forEach(function(fileName) {
        if(!shell.test('-L', './node_modules/.bin/'+ fileName)) {
            shell.ln('-s','../kw-web-suite/node_modules/.bin/' + fileName, './node_modules/.bin/'+ fileName);
        }
    });
}
