import request from "@/utils/request";

export function getContactList(id) {
    return request({
        url: `/contact/value/${id}`,
        method: 'get',
    })
}

export function getRelation(id) {
    return request({
        url: `/contact/${id}`,
        method: 'get',
    })
}
