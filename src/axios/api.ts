import { Request } from "./request";

class api {

    /**
     * 用户模块
     * */
    public static user = {
        /**
         * 获取用户信息
         * @param params {
         *     id <string | number>
         * }
         * */
        GetUserinfo: (params?: {
            id: string | number
        }) => Request.get('/user/get_userinfo/', params),

        /**
         * 用户注册
         * @param params {
         *     username <string>,
         *     password <string>
         * }
         * */
        PostUserRegister: (params?: {
            username: string,
            password: string
        }) => Request.post('/user/post_user_register/', params),
    }

}

export {
    api
}
