import { reactive } from "vue";
import type { joinRoomForm } from "@/type/Home";

const joinRoomFormRule = (joinRoomFormRef: any, joinRoomForm: joinRoomForm) => {
    const rules = reactive({
        roomId: [
            { required: true, message: '请输入房间号', trigger: 'blur' },
            { min: 6, max: 6, message: '长度必须为6', trigger: 'blur' }
        ],
    })

    return rules
}

export {
    joinRoomFormRule
}
