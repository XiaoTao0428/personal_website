import { ref, toRefs, watch } from "vue";
import type { EventLoginDialog, IntLoginDialog } from "@/type/loginAndRegisterDialog";
import { api } from "@/axios/api";

export default (props: IntLoginDialog, emits: EventLoginDialog) => {

    const { dialogVisible } = toRefs(props)
    let activeTabName = ref<string>('login')
    const loginDialogVisible = ref<boolean>(false)
    const loginFromRef  = ref<any>()
    const registerFromRef  = ref<any>()
    const loginBtnLoading  = ref<boolean>(false)
    const registerBtnLoading  = ref<boolean>(false)

    watch(dialogVisible, (newValue, oldValue) => {
        loginDialogVisible.value = newValue
    }, {
        immediate: true
    })

    /**
     * 弹窗 tab 点击事件
     * */
    const handleClickTab = () => {
        loginFromRef.value.resetForm()
        registerFromRef.value.resetForm()
    }

    /**
     * 弹窗关闭前回调
     * */
    const handleClose = () => {
        emits('update:dialogVisible', false)
        loginFromRef.value.resetForm()
        registerFromRef.value.resetForm()
    }

    /**
     * 登录
     * */
    const login = () => {

    }

    /**
     * 登录提交
     * */
    const handleLoginSubmit = () => {
        loginFromRef.value.submitForm(async (formData: any) => {
            console.log(formData)
            if (formData) {

                // handleClose()
            }
        })
    }

    /**
     * 注册提交
     * */
    const handleRegisterSubmit = () => {
        registerFromRef.value.submitForm(async (formData: any) => {
            if (formData) {
                if (registerBtnLoading.value) {
                    return
                }
                registerBtnLoading.value = true
                try {
                    const res = await api.user.PostUserRegister({
                        username: formData.username,
                        password: formData.password
                    })
                    console.log('res', res)
                    if (res) {
                        handleClose()
                    }
                } catch (e) {
                    console.log('catch', e)
                } finally {
                    registerBtnLoading.value = false
                }

            }
        })
    }

    return {
        loginDialogVisible,
        loginFromRef,
        registerFromRef,
        activeTabName,
        loginBtnLoading,
        registerBtnLoading,
        handleClickTab,
        handleClose,
        handleLoginSubmit,
        handleRegisterSubmit
    }
}
