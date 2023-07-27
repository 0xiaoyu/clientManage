import request from "@/utils/request";

const baseurl ='/keyword'

export function addKeyword(data){
    return request({
        url: baseurl+'/addKeyword',
        method: 'post',
        data: data
    })
}

export function getAllKeyword(){
    return request({
        url: baseurl,
        method: 'get'
    })
}

export function getLikeKeyword(data){
    return request({
        url: baseurl+'/getLike',
        method: 'get',
        params: data
    })
}

export function deleteKeyword(data){
    return request({
        url: baseurl,
        method: 'delete',
        params: data
    })
}
