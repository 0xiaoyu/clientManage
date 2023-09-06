import Request from "@/utils/request";

const baseUrl = "/changeNameLog";

export function getChangeNameLogList(params) {
    return Request({
        url: baseUrl + "/page",
        method: "get",
        params
    })
}
