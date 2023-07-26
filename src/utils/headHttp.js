import request from "@/utils/request";

export default (url)=>{
    return request({
        url: url,
        method: 'head'
    })
}
