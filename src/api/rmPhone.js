import Request from "@/utils/request";

const baseUrl = "/rmPhone"

export function rmPhoneAdd(phone) {
    return Request({
        url: baseUrl + "/add",
        method: "put",
        params: {
            phone
        }
    })
}
