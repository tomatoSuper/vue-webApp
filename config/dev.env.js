var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://dev-xa.yingjiashenghuo.com"'
  // API_ROOT: '"http://wxapi35.esheyi.com"'
  // API_ROOT: '"http://api.esheyi.com"'
})
