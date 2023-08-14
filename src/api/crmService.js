import {crmService} from "@/api/request";

export function tracking(customerNum) {
    return crmService({
        url: '/tracking/getTrackData',
        method: 'get',
        params: {
            customerNum
        }
    })
}
