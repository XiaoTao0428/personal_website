import type { IntLoginForm } from "@/type/loginForm";
import { reactive, ref } from "vue";

export default () => {

    const loginFormRef = ref<any>()

    const loginForm = reactive<IntLoginForm>({
        username: '',
        password: '',
    })

    const submitForm = (collBack: Function) => {
        if (!loginFormRef.value) return
        loginFormRef.value.validate((valid: boolean) => {
            if (valid) {
                collBack({
                    ...loginForm
                })
            } else {
                collBack(false)
            }
        })
    }

    const resetForm = () => {
        if (!loginFormRef.value) return
        loginFormRef.value.resetFields()
    }

    return {
        loginFormRef,
        loginForm,
        submitForm,
        resetForm
    }
}
