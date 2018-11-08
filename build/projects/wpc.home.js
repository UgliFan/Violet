const ConfFactory = require('../packages/wpc-factory')

const conf = new ConfFactory();

const client = conf.buildClientConfig();

module.exports = { client };