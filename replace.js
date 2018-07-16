const Replace = require('replace-in-file-webpack-plugin')

module.exports = {
  replacePlugin: (options) => {
    options = options || []
    if ('stg' === process.env.NODE_ENV) {
      const ol = process.env.STG_OL_TILE_HOST || ''
      const leaf = process.env.STG_LEAF_TILE_HOST || ''
      const geo = process.env.STG_GEOCLIENT_HOST || ''
      if (!ol) console.error('process.env.STG_OL_TILE_HOST is unset')
      if (!leaf) console.error('process.env.STG_LEAF_TILE_HOST is unset')
      if (!geo) console.error('process.env.STG_GEOCLIENT_HOST is unset')
      options.push({
        dir: 'dist',
        test: /\.js$/g,
        rules: [
          {search: 'maps{1-4}.nyc.gov', replace: ol}, 
          {search: 'maps{s}.nyc.gov', replace: leaf},
          {search: '//maps.nyc.gov', replace: `//${geo}`}
        ]
      })
    }
    return new Replace(options)      
  }
}