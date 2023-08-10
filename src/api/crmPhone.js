import request from "@/utils/request";


export function getCrmPhoneStart(second) {
    return request({
        url: `/crmPhone/start/${second}`,
        method: 'get',
    })
}

export function getCrmPhoneStop() {
    return request({
        url: `/crmPhone/stop`,
        method: 'get',
    })
}

export function getCrmPhoneDefaultStart() {
    return request({
        url: `/crmPhone/start`,
        method: 'get',
    })
}

export function getCrmPhoneStatus() {
    return request({
        url: `/crmPhone/status`,
        method: 'get',
    })
}
