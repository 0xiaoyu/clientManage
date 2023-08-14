import request from "@/utils/request";

const baseUrl = "/crmPhone";

export function getCrmPhoneStart(second) {
    return request({
        url: baseUrl + `/start/${second}`,
        method: 'get',
    })
}

export function getCrmPhoneStop() {
    return request({
        url: baseUrl + `/stop`,
        method: 'get',
    })
}

export function getCrmPhoneDefaultStart() {
    return request({
        url: baseUrl + `/start`,
        method: 'get',
    })
}

export function getCrmPhoneStatus() {
    return request({
        url: baseUrl + `/status`,
        method: 'get',
    })
}
