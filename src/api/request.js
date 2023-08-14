import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: '/api',
    timeout: 150000, // request timeout
})

const mockService = axios.create({
    baseURL: '/mock',
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
        this.$message({
            type: "error",
            message: error
        })
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        if (response.status !== 200) {
            this.$message({
                type: "error",
                message: response.data
            })
        }
        return response.data
    }
)

export default service
