var path = require('path')
var index = __dirname.indexOf("node_modules")
var rootPath = __dirname.substring(0,index);
var geeksConfig = {rootPath: rootPath}

module.exports = geeksConfig;
