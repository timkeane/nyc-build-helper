const Replace = require('replace-in-file-webpack-plugin')
const buildEnv = require('./build')

module.exports = {
  replacePlugin: (projDir, options) => {
    const build = buildEnv.getEnv(projDir)
    options = options || []
    if (build.projName !== 'nyc-lib') {
      options.push({
        dir: 'dist',
        files: ['index.html'],
        rules: [{
          search: /%ver%/g,
          replace: build.projVer
        }]
      })
      if (build.isPrd) {
        options.push({
          dir: 'dist',
          files: ['index.html'],
            rules: [{
            search: '<!-- google analytics -->',
            replace: build.googleAnalytics
          }]
        })
      }    
    }
    if (build.geoclientKey) {
      options.push({
        dir: 'dist/js',
        files: [`${build.projName}.js`],
        rules: [{
          search: 'app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
          replace: build.geoclientKey
        }]
      })  
    }
    if (build.directionsUrl) {
      if (build.projName === 'nyc-lib') {
        console.warn('=======================================================================')
        options.push({
          dir: 'dist/examples/ol',
          test: /\.html$/,
          rules: [{
            search: /https:\/\/maps\.googleapis\.com\/maps\/api\/js\?&sensor=false&libraries=visualization/g,
            replace: build.directionsUrl
          }]
        })
      }
      options.push({
        dir: 'dist/js',
        files: [`${build.projName}.js`],
        rules: [{
          search: /https:\/\/maps\.googleapis\.com\/maps\/api\/js\?&sensor=false&libraries=visualization/g,
          replace: build.directionsUrl
        }]
      })
    }
    if (build.isStg) {
      console.warn(build);
      options.push({
        dir: 'dist/js',
        files: [`${build.projName}.js`],
        rules: [
          {search: 'maps{1-4}.nyc.gov', replace: build.olTileHost}, 
          {search: 'maps{s}.nyc.gov', replace: build.leafTileHost},
          {search: '//maps.nyc.gov', replace: `//${build.geoclientHost}`}
          {search: 'https://maps.nyc.gov/nyc-lib/icons', replace: `//${build.iconUrl}`}
        ]
      })
    }
    return new Replace(options)
  }
}