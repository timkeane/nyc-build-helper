const path = require('path')
const buildEnv = require('./build')
const copy = require('./copy')
const replace = require('./replace')
const webpack = require('webpack')
const Minify = require('babel-minify-webpack-plugin')
const Clean = require('clean-webpack-plugin')

module.exports = {
  defaultWebpackConfig: (projDir, options) => {
    const build = buildEnv.getEnv(projDir)
    console.log(build)

    options = options || {}
    
    const plugins = [
      new Clean(['dist'], {root: projDir}),
      new webpack.optimize.ModuleConcatenationPlugin(),
      copy.copyPlugin(projDir, options.copyOptions),
      replace.replacePlugin(projDir, options.replaceOptions),
      new Minify()
    ]

    return {
      entry: path.resolve(projDir, 'src/js/index.js'),
      output: {
         path: path.resolve(projDir, 'dist'),
         filename: `js/${build.projName}.js`
      },
      devtool: (build.isStg || build.isPrd) ? false : 'cheap-module-eval-source-map',
      module: {
        rules: [{
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }]
      },
      externals: {
        jquery: 'jQuery',
        'text-encoding': 'window',
        leaflet: 'L',
        shapefile: '(window.shapefile || {})',
        papaparse: '(window.Papa || {})',
        proj4: '(window.proj4 || {defs: function(){}})'
      },
      plugins: plugins
    }
  }
}


