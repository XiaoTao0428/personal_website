import { reactive } from "vue";
import type { IntLoginForm } from "@/type/loginForm";

export default (loginFormRef: any, loginForm: IntLoginForm) => {

    const validatePass = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('请输入密码'))
        } if (value.length < 6) {
            callback(new Error('密码长度不能小于6'))
        }
    }

    const rules = reactive({
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 15, message: '长度必须在 3 到 15 之间', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能小于6', trigger: 'blur' },
        ],
    })

    return {
        rules
    }
}
