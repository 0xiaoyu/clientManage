const {defineConfig} = require('@vue/cli-service')
const path = require("path");


function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        port: 9527,
        proxy: {
            '/api': {
                target: 'http://localhost:9528/',
                changeOrigin: true,
                pathRewrite: {'^/api': ''},
            },
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
            }
        },
    }
})

