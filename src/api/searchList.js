import request from "@/utils/request";

const baseURL = '/search'

export function getAllCompany(data) {
    return request({
        url: baseURL,
        method: 'get',
        params: data
    })
}

export function insertHandled(data) {
    return request({
        url: baseURL + '/insertHandled',
        method: 'put',
        data: data
    })
}

export function getAllType() {
    return request({
        url: baseURL + '/getAllType',
        method: 'get'
    })
}


export function getAllTag() {
    return request({
        url: baseURL + '/getTag',
        method: 'get'
    })
}

export function addTag(data) {
    return request({
        url: baseURL + '/addTag',
        method: 'post',
        data: data
    })
}

export function deleteTagById(data) {
    return request({
        url: baseURL + '/tag',
        method: 'delete',
        params: data
    })
}


export function getAllChangePhone() {
    return request({
        url: baseURL + '/getAllChange',
        method: 'get'
    })
}
