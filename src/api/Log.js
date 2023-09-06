import request from "@/utils/request";

const baseUrl = "/log";

export function getLogList(params) {
    return request({
        url: baseUrl,
        method: "get",
        params
    });
}
