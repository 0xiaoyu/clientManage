import request from "@/utils/request";

const baseUrl = "/crm";

export function getUsers() {
    return request({
        url: `${baseUrl}/users`,
        method: "get"
    });
}

export function synchronClient(data) {
    return request({
        url: `${baseUrl}/client`,
        method: "post",
        data
    });
}

export function getLog(params) {
    return request({
        url: baseUrl + "/log",
        method: "get",
        params
    });
}

export function CrmCount(params) {
    return request({
        url: baseUrl + "/count",
        method: "get",
        params
    });
}
