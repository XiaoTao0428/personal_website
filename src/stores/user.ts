import {defineStore} from "pinia";

export const useUsersStore = defineStore('users', {
    state: () => {
        return {
            token: '',  // 用户 token
            loginStatus: 0,  // 登陆状态  0:未登录; 1:已登录
        }
    }
})
