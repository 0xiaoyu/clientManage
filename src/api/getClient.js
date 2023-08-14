import request from "@/api/request";

const baseUrl = "/getClient"

export function getClientList(data) {
    return request({
        url: baseUrl,
        method: "post",
        data
    });
}

export function getClientByJSON(data) {
    return request({
        url: baseUrl + "/json",
        method: "post",
        data
    });
}

export function getLog(params) {
    return request({
        url: baseUrl + "/selectLog",
        method: "get",
        params
    });
}

export function stopClient(id) {
    return request({
        url: baseUrl + `/stop/${id}`,
        method: "get"
    })
}
