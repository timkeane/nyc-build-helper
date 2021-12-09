const fs = require('fs')
const Client = require('ssh2').Client
const zipdir = require('zip-a-folder').zip
const buildEnv = require('./build')

require('dotenv').config()

const error = (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}

const nodeEnv = process.env.NODE_ENV
const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1

const deploy = (projDir, projName, projVer, archiveFile) => {
  let archiveDir = `${process.env.DEPLOY_DIR}/${projName}/archive`
  let deployDir = `${process.env.DEPLOY_DIR}/${projName}/${projVer}`
  if (projName !== 'nyc-lib') {
    projVer = `v${projVer}`
    archiveDir = `${process.env.DEPLOY_DIR}/archive`
    deployDir = `${process.env.DEPLOY_DIR}/${projName}`    
  }
  const cmds = [
    `mkdir -p ${archiveDir}`,
    `mkdir -p ${deployDir}`,
    `mv ${deployDir} ${deployDir}.bak`,
    `mkdir ${deployDir}`,
    `unzip ${archiveDir}/${archiveFile} -d ${deployDir}`,
    `rm -rf ${deployDir}.bak`
  ]

  const conn = new Client()
  const host = isProd ? process.env.PRD_DEPLOY_HOST : process.env.STG_DEPLOY_HOST
  console.warn(`archiveFile ${archiveFile}`)
  console.warn(`archiveDir ${archiveDir}`)
  console.log(`deploying ${archiveFile} to ${host}`)

  conn.on('ready', function() {
    console.log('CONNECTED')
    conn.sftp((err, sftp) => {
      error(err)
      const read = fs.createReadStream(archiveFile)
      const write = sftp.createWriteStream(`${archiveDir}/${archiveFile}`)
      write.on('close', () => {
        sftp.end()
        conn.exec(cmds.join(';'), function(err, stream) {
          error(err)
          stream.on('close', function(code, signal) {
            console.log('DEPLOYED SUCCESSFULLY')
            conn.end()
          }).on('data', function(data) {
            console.log(`${data}`)
          }).stderr.on('data', function(data) {
            console.log('ERROR')
            console.log(`${data}`)
          })
        })
      })
      read.pipe(write)
    })
  }).connect({
    host: host,
    username: process.env.DEPLOY_USER,
    privateKey: fs.readFileSync(`${process.env.HOME}/.ssh/id_rsa`),
    port: 22
  })
}

module.exports = async function(projDir) {
  const build = buildEnv.getEnv(projDir)
  const projVer = `v${build.projVer}`
  const archiveFile = `${build.projName}-${projVer}-${nodeEnv}.zip`
  console.log(`zipping distribution to ${archiveFile}`)
  await zipdir('./dist', archiveFile)
}
