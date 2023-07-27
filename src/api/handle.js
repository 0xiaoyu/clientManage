import request from "@/utils/request";

const baseUrl = "handle/"

export function getAllHandled(data){
    return request({
        url: baseUrl + 'getAllInfo',
        method: 'get',
        params: data
    })
}

export function addCrm(data){
    return request({
        url: baseUrl + 'addCrm',
        method: 'post',
        data: data
    })
}

export function deleteCrm(data){
    return request({
        url: baseUrl + data,
        method: 'delete'
    })
}

export function updateHand(data){
    return request({
        url: baseUrl,
        method: 'put',
        data: data
    })
}
