const parseArgs = require('minimist')
const Dropbox = require('dropbox')
const stringify = require('csv-stringify')
const util = require('util')

const argv = parseArgs(process.argv.slice(2))

const usage = () => {
  console.log('Please supply a --token value')
}

const parseFolder = (folder) => {
  const dbx = new Dropbox({ accessToken: argv.token })
  return dbx.filesListFolder({
    path: folder ? folder : ''
  })
    .then((response) => {
      const rows = response.entries ? response.entries.map((entry) => {
        return [
          entry.path_display
        ]
      }) : []
      return util.promisify(stringify)(rows, {})
    })
    .then((csv) => {
      console.log(csv)
    })
}

if (!argv.token || argv.token.trim().length === 0) {
  usage()
} else {
  parseFolder(argv.length > 0 ? argv[0] : null)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(-1)
    })
}
