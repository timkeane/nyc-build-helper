const path = require('path')
const buildEnv = require('./build')
const copy = require('./copy')
const replace = require('./replace')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const Minify = require('terser-webpack-plugin')

module.exports = {
  defaultWebpackConfig: (projDir, options) => {
    const build = buildEnv.getEnv(projDir)

    options = options || {}
    
    const plugins = [
      new CleanWebpackPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      copy.copyPlugin(projDir, options.copyOptions),
      replace.replacePlugin(projDir, options.replaceOptions),
      new Minify({
        parallel: true,
        cache: true,
        sourceMap: true,
        terserOptions: {
         output: {
              ascii_only: true
          }
        }
      })
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
          // exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env']
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


