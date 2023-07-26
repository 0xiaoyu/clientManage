import request from "@/utils/request";

const baseurl ='/api/keyword'

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
