import request from "@/utils/request";

const baseUrl = "/companyInfo";

export function getCompanyInfo(params) {
    return request({
        url: `${baseUrl}/getCompanyInfo`,
        method: "get",
        params
    });
}


export function getInvInfo(params) {
    return request({
        url: `${baseUrl}/getInv`,
        method: "get",
        params
    });
}

export function getJob(params) {
    return request({
        url: `${baseUrl}/getJob`,
        method: "get",
        params
    });
}

export function getInfoCount(params) {
    return request({
        url: `${baseUrl}/getInfoCount`,
        method: "get",
        params
    });
}

export function getPatent(params) {
    return request({
        url: `${baseUrl}/getPatent`,
        method: "get",
        params
    });
}

export function getNetPromotion(params) {
    return request({
        url: `${baseUrl}/getNetPromotion`,
        method: "get",
        params
    });
}

export function getBaike(params) {
    return request({
        url: `${baseUrl}/getBaike`,
        method: "get",
        params
    });
}

export function getTender(params) {
    return request({
        url: `${baseUrl}/getTender`,
        method: "get",
        params
    });
}
