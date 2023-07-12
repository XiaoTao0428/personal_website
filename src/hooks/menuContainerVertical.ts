import { computed, ref } from 'vue'
import type { IntMenuContainerVertical } from "@/type/menuContainerVertical";
import { useRoute, useRouter } from "vue-router";

export default () => {
    const route = useRoute()
    const router = useRouter()

    const isCollapse = ref<boolean>(false)
    // 页面刷新时依然会高亮当前页面对应的菜单选项
    const isDefaultActive = computed(() => {
        return route.path
    })
    const handleSelect = (index: string, keyPath: string[]) => {
        try {
            router.push({
                path: index,
                query: {
                    id: 123
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    return { isCollapse, isDefaultActive, handleSelect }
};
