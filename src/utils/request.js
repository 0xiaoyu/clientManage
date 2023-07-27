import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: '/api',
    timeout: 150000, // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        return response.data
    }
)

export default service
