import { type IntRegisterForm } from "@/type/registerForm";
import { reactive, ref } from "vue";

export default () => {

    const registerFormRef = ref<any>()

    const registerForm = reactive<IntRegisterForm>({
        username: '',
        password: '',
        checkPassword: '',
    })

    const submitForm = (collBack: Function) => {
        if (!registerFormRef.value) return
        registerFormRef.value.validate((valid: boolean) => {
            if (valid) {
                collBack({
                    ...registerForm
                })
            } else {
                collBack(false)
            }
        })
    }

    const resetForm = () => {
        if (!registerFormRef.value) return
        registerFormRef.value.resetFields()
    }

    return {
        registerFormRef,
        registerForm,
        submitForm,
        resetForm
    }
}
