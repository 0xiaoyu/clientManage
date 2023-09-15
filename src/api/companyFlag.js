import Request from "@/utils/request"

const baseUrl = "/company-flag"

export function getCompanyFlagList(params) {
    return Request({
        url: baseUrl + `/${params.type}`,
        method: "get",
        params
    })
}
