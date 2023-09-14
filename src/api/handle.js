import request from "@/utils/request";

const baseUrl = "handle/"

export function getAllHandled(data) {
    return request({
        url: baseUrl + 'getAllInfo',
        method: 'get',
        params: data
    })
}

export function updateCrm(data) {
    return request({
        url: baseUrl + 'crm',
        method: 'put',
        data: data
    })
}

export function deleteCrm(data) {
    return request({
        url: baseUrl + data,
        method: 'delete'
    })
}

export function updateHand(data) {
    return request({
        url: baseUrl,
        method: 'put',
        data: data
    })
}

export function deleteHand() {
    return request({
        url: baseUrl,
        method: 'delete'
    })
}

export function updateCompany(data) {
    return request({
        url: baseUrl + 'update',
        method: 'PATCH',
        data
    })
}
