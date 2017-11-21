var utils = require('./utils')
var config = require('../config')
var env = process.env.NODE_ENV
var isProduction = env === 'production' || env === 'pre' || env === 'test'
var sourcePath
if (env === 'production') {
  sourcePath = config.build.productionSourceMap
} else if (env === 'development') {
  sourcePath = config.dev.cssSourceMap
} else if (env === 'pre') {
  sourcePath = config.pre.productionSourceMap
} else if (env === 'tst') {
  sourcePath = config.tst.productionSourceMap
}
module.exports = {
  loaders: utils.cssLoaders({
    // sourceMap: isProduction
    //   ? config.build.productionSourceMap
    //   : config.dev.cssSourceMap,
    sourceMap: sourcePath,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
