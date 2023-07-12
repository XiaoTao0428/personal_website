import axios, {type AxiosRequestConfig, type Method} from "axios";
import router from "@/router";
import { ElMessage } from 'element-plus';
import { useUsersStore } from '@/stores/user';

const usersStore = useUsersStore()

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        name: 'LoginPage',
    })
}

/**
 * 请求失败后的错误统一处理
 * @param status {Number} 请求失败的状态码
 * @param other {String}
 */
const errorHandle = (status: number, other: string) => {
    // 状态码判断
    switch (status) {

        case 302:
            ElMessage({
                message: '接口重定向了！',
                type: 'error',
                showClose: true
            })
            break
        case 400:
            ElMessage({
                message: other,
                type: 'error',
                showClose: true
            })
            break
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401: //重定向
            // message.error("token:登录失效==>" + status + ":" + store.state.Roles)
            ElMessage({
                message: '未登录，请先登录',
                type: 'error',
                showClose: true
            })
            // router.replace({
            //     path: '/Login',
            // })
            break
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            ElMessage({
                message: '登录已过期',
                type: 'error',
                showClose: true
            })
            usersStore.token = ''
            // setTimeout(() => {
            //     router.replace({
            //         path: '/Login',
            //     })
            // }, 1000)
            break
        case 404:
            ElMessage({
                message: '网络请求不存在',
                type: 'error',
                showClose: true
            })
            break
        case 410:
            ElMessage({
                message: '请求的资源已被删除',
                type: 'error',
                showClose: true
            })
            break
        case 500:
            ElMessage({
                message: '服务器发生错误，请检查服务器',
                type: 'error',
                showClose: true
            })
            break
        // case 502:
        //     ElMessage({
        //         message: '网关错误',
        //         type: 'error',
        //         showClose: true
        //     })
        //     break
        // case 503:
        //     ElMessage({
        //         message: '服务不可用，服务器暂时过载或维护',
        //         type: 'error',
        //         showClose: true
        //     })
        //     break
        // case 504:
        //     ElMessage({
        //         message: '网关超时',
        //         type: 'error',
        //         showClose: true
        //     })
        //     break
        default:
            ElMessage({
                message: other,
                type: 'error',
                showClose: true
            })
    }
}

interface PendingType {
    url?: string
    method?: Method | string
    params: any
    data: any
    cancel: any
}
// 取消重复请求
const pending: Array<PendingType> = []
const CancelToken = axios.CancelToken

/**
 * 移除重复请求
 * */
const removePending = (config: AxiosRequestConfig, limit: number = 1) => {
    let num = 0
    for (let key in pending) {
        const item: PendingType = pending[key]
        // 当前请求在数组中存在时执行函数体
        if (item.url === config.url && item.method === config.method && JSON.stringify(item.params) === JSON.stringify(config.params) && JSON.stringify(item.data) === JSON.stringify(config.data)) {
            num++
            if (num > limit) {
                // 执行取消操作
                item.cancel('CUSTOM_ERR_CANCELED')
                // 从数组中移除记录
                pending.splice(Number(key), 1)
            }
        }
    }
}

/* 实例化请求配置 */
const instance = axios.create({
    headers: {
        //php 的 post 传输请求头一定要这个 不然报错 接收不到值
        // "Content-Type": "application/jsoncharset=UTF-8",
        "Access-Control-Allow-Origin-Type": '*'
    },
    // 请求时长
    timeout: 1000 * 30,
    // 请求的base地址
    baseURL: import.meta.env.VITE_APP_URL + ':3000/api',
    // 表示跨域请求时是否需要使用凭证
    withCredentials: false,
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

/**
 * 请求拦截器
 * 重复的请求将被取消
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use((req) => {

    req.cancelToken = new CancelToken((c) => {
        pending.push({
            url: req.url,
            method: req.method,
            params: req.params,
            data: req.data,
            cancel: c
        })
    })
    removePending(req, 1)

    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    // const token = store.state.token
    // localStorage.setItem('token', token)

    if (usersStore.token) {
        req.headers.Authorization = usersStore.token
    }
    return req
}, (error) => {
    ElMessage({
        message: '请求失败',
        type: 'error',
        showClose: true,
    })
    removePending(error.config, 0)
    // return Promise.reject(error.data.error.message)
    return Promise.reject(error)
})

/**
 * 响应拦截器
 * */
instance.interceptors.response.use((res) => {
    removePending(res.config, 0)
    // 请求成功
    if (res.status === 200 || res.status === 204) {
        return Promise.resolve(res.data)
    } else {
        return Promise.reject(res)
    }
}, (error) => {
    if (error.message === 'CUSTOM_ERR_CANCELED') {
        ElMessage({
            message: '操作太频繁，请稍后再试',
            type: 'error',
            showClose: true,
        })
        return Promise.reject(error)
    } else {
        removePending(error.config, 0)
    }
    const { response } = error
    if (response) {
        console.log(error)
        errorHandle(response.status, response.data.message)
        return Promise.reject(response.data)
    } else {
        // 处理断网的情况
        // eg:请求超时或断网时，更新state的network状态
        // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
        // 后续增加断网情况下做的一些操作
        // store.commit('networkState', false)
        if (error.code === 'ERR_NETWORK') {
            ElMessage({
                message: '网络异常',
                type: 'error',
                showClose: true,
            })
        } else if (error.code === 'ECONNABORTED') {
            ElMessage({
                message: '请求超时',
                type: 'error',
                showClose: true,
            })
        } else {
            ElMessage({
                message: error.message,
                type: 'error',
                showClose: true,
            })
        }
        return Promise.reject(error)
    }
})

// 只需要考虑单一职责，这块只封装axios
export default instance
