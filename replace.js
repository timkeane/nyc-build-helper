const Replace = require('replace-in-file-webpack-plugin')

module.exports = {
  replacePlugin: (options) => {
    options = options || []
    if ('stg' === process.env.NODE_ENV) {
      options.push({
        dir: 'dist',
        test: /\.js$/g,
        rules: [{
          search: 'maps{1-4}.nyc.gov',
          replace: process.env.STG_OL_TILE_HOST
        }, {
          search: 'maps{s}.nyc.gov',
          replace: process.env.STG_LEAF_TILE_HOST
        }, {
          search: '//maps.nyc.gov',
          replace: `//${process.env.STG_GEOCLIENT_HOST}`
        }]
      })
    }
    return new Replace(options)      
  }
}