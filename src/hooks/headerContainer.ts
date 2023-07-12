import { type Component, reactive, ref, toRefs } from "vue";
import DefaultAvatar from '@/components/headerContainer/defaultAvatar.vue'
import { useUsersStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import type { IntHeaderContainer, Userdata } from "@/type/headerContainer";

export default () => {
    const MyIcon: Component | any = DefaultAvatar  // 默认的用户头像

    const userdata = reactive(<Userdata>{
        // avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        avatarUrl: '',
    })

    const { avatarUrl } = toRefs(userdata)

    const popoverShowRef = ref<HTMLDivElement>()  // 弹出层附着目标
    const popoverRef = ref<HTMLDivElement>()  // 弹出层

    const usersStore = useUsersStore()

    const { loginStatus } = storeToRefs(usersStore)

    let loginDialogVisible = ref<boolean>(false)

    /**
     * 登录
     * */
    const handleLogin = () => {
        if (loginStatus.value !== 1) {
            loginDialogVisible.value = true
        }
        // usersStore.$patch((state) => {
        //     state.loginStatus = 1
        // })
    }

    /**
     * 退出登录
     * */
    const handleLogout = () => {
        usersStore.$patch((state) => {
            state.loginStatus = 0
        })
    }

    return {
        MyIcon,
        avatarUrl,
        popoverShowRef,
        popoverRef,
        loginStatus,
        loginDialogVisible,
        handleLogin,
        handleLogout
    }
}
