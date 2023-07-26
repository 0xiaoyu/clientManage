import request from "@/utils/request";

const baseUrl = "/api/log";

export function getLogList(params) {
    return request({
        url: baseUrl,
        method: "get",
        params
    });
}
