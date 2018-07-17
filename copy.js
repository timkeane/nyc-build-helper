const Copy = require('copy-webpack-plugin')
const path = require('path')
const buildEnv = require('./build')

module.exports = {
  copyPlugin: (projDir, options) => {
    const build = buildEnv.getEnv(projDir)
    options = options || []
    if (build.projName !== 'nyc-lib') {
      options.push(path.resolve(projDir, 'node_modules/nyc-lib/nyc/mta/mta.html'))
    }
    options = options.concat([
      path.resolve(projDir, 'src/index.html'),
      path.resolve(projDir, 'src/manifest.webmanifest'),
      {from: path.resolve(__dirname, 'babel-polyfill.js'), to: 'js'},
      {from: path.resolve(projDir, 'src/img'), to: 'img'},
      {from: path.resolve(projDir, 'src/data'), to: 'data'},
      {
        from: path.resolve(projDir, `node_modules/nyc-lib/css/build/nyc.ol.${build.projName}.theme.css`),
        to: `css/${build.projName}.css`,
        type: 'dir'
      }
    ])
    return new Copy(options)
  }
}