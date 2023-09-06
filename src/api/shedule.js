import request from "@/utils/request";

const baseUrl = "/schedule"

export function addSchedule(data) {
    return request({
        url: baseUrl + "/add",
        method: "post",
        data
    })
}

export function updateSchedule(data) {
    return request({
        url: baseUrl + "/update",
        method: "put",
        data
    })
}

export function deleteSchedule(id) {
    return request({
        url: baseUrl + `/delete/${id}`,
        method: "delete"
    })
}

export function changesScheduleStatus(id, status) {
    return request({
        url: baseUrl + `/changesStatus/${id}/${status}`,
        method: "put",
    });
}

export function resetAllSchedule() {
    return request({
        url: baseUrl + "/resetAll",
        method: "put",
    });
}

export function getScheduleById(id) {
    return request({
        url: baseUrl + `/${id}`,
        method: "get",
    })
}
