
const client = require('./wpc.client')
const server = require('./wpc.server')

const result = process.env.ONLY_CLIENT === '1' ? [ client ] : [ client, server ]
module.exports = result
