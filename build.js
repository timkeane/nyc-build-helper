require('dotenv').config()

module.exports = {
  getEnv: (projDir) => {
    const nodeEnv = process.env.NODE_ENV
    const pkg = require(`${projDir}/package.json`)

    const geoclient = process.env.GEOCLIENT_KEY || ''
    const directions = process.env.GOOGLE_DIRECTIONS || ''
    if (!geoclient) console.error('process.env.GEOCLIENT_KEY is unset')
    if (!directions) console.error('process.env.GOOGLE_DIRECTIONS is unset')
    
    const buildEnv = {
      NODE_ENV: nodeEnv,
      projName: pkg.name,
      projVer: pkg.version,
      isPrd: ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1,
      isStg: ['stg', 'stage', 'staging'].indexOf(nodeEnv) > -1,
      geoclientKey: geoclient,
      directionsUrl: directions
    }
    console.warn(buildEnv)

    if (buildEnv.isStg) {
      const ol = process.env.STG_OL_TILE_HOST || ''
      const leaf = process.env.STG_LEAF_TILE_HOST || ''
      const geo = process.env.STG_GEOCLIENT_HOST || ''
      const icon = process.env.STG_ICON_BASE_URL || ''
      if (!ol) console.error('process.env.STG_OL_TILE_HOST is unset')
      if (!leaf) console.error('process.env.STG_LEAF_TILE_HOST is unset')
      if (!geo) console.error('process.env.STG_GEOCLIENT_HOST is unset')
      if (!icon) console.error('process.env.STG_ICON_BASE_URL is unset')
      buildEnv.olTileHost = ol
      buildEnv.leafTileHost = leaf
      buildEnv.geoclientHost = geo
      buildEnv.iconUrl = icon
    }

    if (buildEnv.isPrd) {
      const ga = process.env.GOOGLE_ANALYTICS || ''
      if (!ga) console.error('process.env.GOOGLE_ANALYTICS is unset')
      buildEnv.googleAnalytics = ga
    }

    return buildEnv
  }
}