import request from "@/utils/request";

const baseURL = '/api/search'

export function getAllCompany(data){
    return request({
        url: baseURL,
        method: 'get',
        params: data
    })
}

export function insertHandled(data){
    return request({
        url: baseURL + '/insertHandled',
        method: 'put',
        data: data
    })
}

export function getAllType(){
    return request({
        url: baseURL + '/getAllType',
        method: 'get'
    })
}
