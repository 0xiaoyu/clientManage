import Request from "@/utils/request";

const baseUrl = "/all";


export function changeName(oldName, newName) {
    return Request({
        url: baseUrl + "/changeName",
        method: "patch",
        params: {
            oldName,
            newName
        }
    })
}

export function getAllByName(name) {
    return Request({
        url: baseUrl + "/byName",
        method: "get",
        params: {
            name
        }
    })
}
