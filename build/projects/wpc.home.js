const ConfFactory = require('../packages/wpc-factory')
process.env.ONLY_CLIENT = '1';

const conf = new ConfFactory();
const client = conf.buildClientConfig();

module.exports = { client };