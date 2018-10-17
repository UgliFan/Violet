const { resolve } = require('path')
const merge = require('webpack-merge')
const PROJECT_NAME = process.env.PROJECT_NAME || 'tbk_fe'

const client = merge.smart(require(`./projects/wpc.${PROJECT_NAME}.js`).client, {
    resolve: {
        alias: {
            '~': resolve(__dirname, `../src/${PROJECT_NAME}`),
            '~public': resolve(__dirname, '../src/public')
        }
    }
})
module.exports = client
