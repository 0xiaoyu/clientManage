import request from "@/utils/request";

const baseUrl = "/crm"

export function tracking(customerNum) {
    return request({
        url: '/tracking/getTrackData',
        method: 'get',
        params: {
            customerNum
        }
    })
}

export function getCrmListByPage(page, params) {
    return request({
        url: baseUrl + `/${page.page}/${page.pageSize}`,
        method: 'get',
        params
    })
}

export function getCrmCount(params) {
    return request({
        url: baseUrl + '/count',
        method: 'get',
        params
    })
}

export function updateCrmById(params) {
    return request({
        url: baseUrl + '/update',
        method: 'put',
        params
    })
}
