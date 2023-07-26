const {defineConfig} = require('@vue/cli-service')
const path = require("path");


function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        port: 80,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {'^/api': ''},
            },
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
    }
})

