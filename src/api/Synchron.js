import request from "@/utils/request";

const baseUrl = "/api/crm";

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
