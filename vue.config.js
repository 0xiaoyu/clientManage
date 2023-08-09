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
        open: true,
        proxy: {
            '/api': {
                target: 'http://124.222.114.218:9528/',
                // target: 'http://localhost:9529/',
                changeOrigin: true,
                pathRewrite: {'^/api': ''},
            },
            '/mock': {
                target: 'https://console-mock.apipost.cn/mock/7289cde3-a4fa-4da9-e39a-2614d4c10c41/',
                changeOrigin: true,
                pathRewrite: {'^/mock': ''},
            }
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

