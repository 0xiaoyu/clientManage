import request from "@/api/request";

const baseUrl = "/contact";

export function getContactList(id) {
    return request({
        url: baseUrl + `/value/${id}`,
        method: 'get',
    })
}

export function getRelation(id) {
    return request({
        url: baseUrl + `/${id}`,
        method: 'get',
    })
}
