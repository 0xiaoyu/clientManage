import request from "@/utils/request";

const baseUrl = "/all";


export function changeName(oldName, newName) {
    return request({
        url: baseUrl + "/changeName",
        method: "patch",
        params: {
            oldName,
            newName
        }
    })
}
