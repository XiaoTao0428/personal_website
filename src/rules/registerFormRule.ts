import { reactive } from "vue";
import type { IntRegisterForm } from "@/type/registerForm";

export default (registerFormRef: any, registerForm: IntRegisterForm) => {

    const validatePass = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('请输入密码'))
        } if (value.length < 6) {
            callback(new Error('密码长度不能小于6'))
        } else {
            if (registerForm.checkPassword !== '') {
                if (!registerFormRef.value) return
                registerFormRef.value.validateField('checkPassword', () => null)
            }
            callback()
        }
    }

    const validatePass2 = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value !== registerForm.password) {
            callback(new Error("两次输入的密码不相同!"))
        } else {
            callback()
        }
    }

    const rules = reactive({
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 15, message: '长度必须在 3 到 15 之间', trigger: 'blur' }
        ],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
    })

    return {
        rules
    }
}
