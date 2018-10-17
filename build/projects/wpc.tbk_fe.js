const ConfFactory = require('../packages/wpc-factory')

const conf = new ConfFactory();

const client = conf.buildClientConfig();
const server = conf.buildServerConfig();

module.exports = { client, server };