import request from "@/utils/request";

const baseurl = '/keyword'

export function addKeyword(data) {
    return request({
        url: baseurl + '/addKeyword',
        method: 'post',
        data: data
    })
}

export function getAllWord() {
    return request({
        url: baseurl,
        method: 'get'
    })
}

export function getAllKeyWord() {
    return request({
        url: baseurl + "/keyword",
        method: 'get'
    })
}

export function getLikeKeyword(data) {
    return request({
        url: baseurl + '/getLike',
        method: 'get',
        params: data
    })
}

export function deleteKeyword(data) {
    return request({
        url: baseurl,
        method: 'delete',
        params: data
    })
}

export function getAllFilter(params) {
    return request({
        url: baseurl + '/filter',
        method: 'get',
        params
    })
}
