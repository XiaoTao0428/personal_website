import { reactive, ref } from "vue";
import { io } from "socket.io-client";
import { ElMessage } from "element-plus";

export default () => {
    const myVideoChatRef = ref<HTMLVideoElement>()
    // P2P（端对端）模式
    const otherVideoChatRef = ref<HTMLVideoElement>()
    let myChatVideoInfo = reactive({
        roomId: '',
    })
    // TODO 1对多模式
    let otherVideoChatIds = reactive<{
        streamId: string | number,
        domId: string | number,
    }[]>([])

    // const socket = io('ws://192.168.1.2:3000/')
    // const socket = io('ws://' + import.meta.env.VITE_APP_URL + ':3000/')
    const socket = io('https://taoyuan0428.cn/')
    let peer:RTCPeerConnection  // RTCPeerConnection对象
    let stream:MediaStream  // 生成的媒体文件
    let sender:RTCRtpSender  // 媒体发送者

    /**
     * 初始化RTCPeerConnection
     * */
    const initPeer = () => {
        if (!peer || peer.connectionState === 'closed' || peer.connectionState === 'failed') {
            // TODO RTCPeerConnection兼容性处理
            peer = new RTCPeerConnection()
        }
    }

    /**
     * 创建我的画面
     * */
    const createMedia = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('the getUserMedia is not supported!')
            ElMessage({
                message: '浏览器不支持获取 navigator.mediaDevices',
                type: 'error',
                showClose: true
            })
            return
        } else {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                console.log('获取成功', stream)
            } catch (e: any) {
                let errorData: any = {
                    NotFoundError: 'required track is missing',
                    DevicesNotFoundError: 'required track is missing',
                    NotReadableError: 'webcam or mic are already in use',
                    TrackStartError: 'webcam or mic are already in use',
                    OverconstrainedError: 'constraints can not be satisfied by avb. devices',
                    ConstraintNotSatisfiedError: 'constraints can not be satisfied by avb. devices',
                    NotAllowedError: 'permission denied in browser',
                    PermissionDeniedError: 'permission denied in browser',
                    TypeError: 'empty constraints object',
                }
                let msg = errorData[e.name] || 'other errors'
                console.error('摄像头/麦克风获取失败', msg)
                ElMessage({
                    message: '摄像头/麦克风获取失败',
                    type: 'error',
                    showClose: true
                })
                return
            }
        }
    }

    /**
     * 添加媒体轨道与和监听ICE候选
     * */
    const initPeerTrackAndICE = () => {
        if (!stream) return
        // 添加媒体轨道，并传输到对等点
        stream.getTracks().forEach((track) => {
            sender = peer.addTrack(track, stream)
        })

        // 监听对等点添加的媒体音轨
        peer.ontrack = (event) => {
            console.log('ontrack', event)
            // TODO 目前用 if 取消红线报错，以后再进行兼容性处理
            if (otherVideoChatRef.value && 'srcObject' in otherVideoChatRef.value) {
                otherVideoChatRef.value.srcObject = event.streams[0]
            }

            // let otherVideoChatIdObj = {}
            // otherVideoChatIds.forEach(item => {
            //   otherVideoChatIdObj[item.streamId] = item
            // })
            // event.streams.forEach((item, index) => {
            //   let i = 1
            //   if (otherVideoChatIds.length > 0) {
            //     i = otherVideoChatIds[otherVideoChatIds.length - 1].domId + 1
            //   }
            //   if (!otherVideoChatIdObj[item.id]) {
            //     let data = {
            //       streamId: item.id,
            //       domId: i,
            //     }
            //     otherVideoChatIds.push(data)
            //     otherVideoChatIdObj[item.id] = data
            //     nextTick(() => {
            //       let newAddDom = document.getElementById('otherVideoChatId-' + data.domId)
            //       // TODO 目前用 if 取消红线报错，以后再进行兼容性处理
            //       if ('srcObject' in newAddDom) {
            //         newAddDom.srcObject = item
            //       }
            //     })
            //   }
            // })
        }

        // 监听ICE候选
        peer.onicecandidate = (event) => {
            console.log('onicecandidate', event)
            if (event.candidate) {
                socket.emit('EXCHANGE_ICE_CANDIDATE', socket.id, myChatVideoInfo.roomId, event.candidate)
            }
        }
        // 监听ICE候选状态变化
        peer.oniceconnectionstatechange = (event: any) => {
            console.log('ICE connection state change: ' + event.target.iceConnectionState)
        }
    }

    /**
     * 关闭peer通道
     * */
    const peerClose = async () => {
        myChatVideoInfo.roomId = ''
        console.log('myChatVideoInfo', myChatVideoInfo)
        // 停止从指定轨道发送媒体
        for (const track of stream.getTracks()) {
            await track.stop()
            await stream.removeTrack(track)
        }
        peer.close()

        // TODO 目前用 if 取消红线报错，以后再进行兼容性处理
        if (myVideoChatRef.value && otherVideoChatRef.value && 'srcObject' in myVideoChatRef.value && 'srcObject' in otherVideoChatRef.value) {
            myVideoChatRef.value.srcObject = null
            otherVideoChatRef.value.srcObject = null
        }
    }

    /**
     * 初始化房间
     * */
    const initSocketConnect = () => {
        // 已连接
        socket.on('connect', () => {
            console.log('已连接', socket.id)
        })

        // 已关闭
        socket.on('disconnect', (reason) => {
            console.log('已关闭', reason)
            peerClose()
            myChatVideoInfo = {
                roomId: '',
            }
        })

        // 创建房间成功
        socket.on('CREATE_ROOM_SUCCESS', (roomId, offer, msg) => {
            console.log('房间创建成功', roomId, msg)
            ElMessage({
                message: '房间创建成功',
                type: 'success',
                showClose: true
            })
            myChatVideoInfo.roomId = roomId
            // TODO 目前用 if 取消红线报错，以后再进行兼容性处理
            if (myVideoChatRef.value && 'srcObject' in myVideoChatRef.value) {
                myVideoChatRef.value.srcObject = stream
            }
            try {
                peer.setLocalDescription(offer)
            } catch (e) {
                console.error('Offer-setLocalDescription: ', e)
                ElMessage({
                    message: 'e',
                    type: 'error',
                    showClose: true
                })
            }
        })

        // 创建房间失败
        socket.on('CREATE_ROOM_ERROR', (msg) => {
            console.error('房间创建失败', msg)
            ElMessage({
                message: '房间创建失败',
                type: 'error',
                showClose: true
            })
        })

        // 申请加入房间成功
        socket.on('APPLY_JOIN_ROOM_SUCCESS', async (roomId, offer, msg) => {
            console.log('申请加入房间成功', roomId, offer, msg)
            ElMessage({
                message: '申请加入房间成功',
                type: 'success',
                showClose: true
            })
            initPeer()
            myChatVideoInfo.roomId = roomId
            await createMedia()
            // TODO 目前用 if 取消红线报错，以后再进行兼容性处理
            if (myVideoChatRef.value && 'srcObject' in myVideoChatRef.value) {
                myVideoChatRef.value.srcObject = stream
            }
            initPeerTrackAndICE()
            try {
                await peer.setRemoteDescription(offer)
                let answer = await peer.createAnswer()
                await peer.setLocalDescription(answer)
                socket.emit('APPLY_JOIN_ROOM_SUCCESS', socket.id, myChatVideoInfo.roomId, answer)
            } catch (e) {
                console.error('setRemoteDescription || createAnswer || setLocalDescription: ', e)
            }
            joinRoomDialogHandleClose()
        })

        // 申请加入房间失败
        socket.on('APPLY_JOIN_ROOM_ERROR', (roomId, msg) => {
            console.error('申请加入房间失败', roomId, msg)
            ElMessage({
                message: '申请加入房间失败',
                type: 'error',
                showClose: true
            })
        })

        // 交换 ICE 候选人信息
        socket.on('EXCHANGE_ICE_CANDIDATE', (anotherSocketId, roomId, candidate, msg) => {
            console.log('交换成功', anotherSocketId, roomId, candidate, msg)
            if (anotherSocketId !== socket.id) {
                peer.addIceCandidate(candidate)
            }
        })

        // 有人加入了房间
        socket.on('JOINED_ROOM', (anotherSocketId, roomId, answer, msg) => {
            console.log('有人加入了房间', anotherSocketId, roomId, answer, msg)
            if (anotherSocketId !== socket.id) {
                console.log('其他人', peer.signalingState)
                peer.setRemoteDescription(answer)
            }
        })

        // 有人离开了房间
        socket.on('LEFT_ROOM', async (anotherSocketId, roomId, msg) => {
            console.log('有人离开了房间', anotherSocketId, roomId, msg)
            // TODO 目前用 if 取消红线报错，以后再进行兼容性处理
            if (otherVideoChatRef.value && 'srcObject' in otherVideoChatRef.value) {
                otherVideoChatRef.value.srcObject = null
                const offer = await peer.createOffer()
                try {
                    await peer.setLocalDescription(offer)
                } catch (e) {
                    console.error('Offer-setLocalDescription: ', e)
                }
                // 更新offer
                socket.emit('UPDATE_OFFER', socket.id, roomId, offer)
            }
        })

        // 房主切换时触发
        socket.on('CHANGED_HOUSEHOLDER', async (anotherSocketId, roomId, msg) => {
            console.log('房主已切换', anotherSocketId, roomId, msg)
            if (socket.id === anotherSocketId) {
                ElMessage({
                    message: '我已成为房主',
                    type: 'success',
                    showClose: true
                })
            }
        })

        // 房间已关闭
        socket.on('CLOSED_ROOM', (anotherSocketId, roomId, msg) => {
            console.log('房间已关闭', anotherSocketId, roomId, msg)
            ElMessage({
                message: '房间已被关闭',
                type: 'warning',
                showClose: true
            })
            peerClose()
        })

    }

    /**
     * 创建房间
     * */
    const createRoom = async () => {
        if (socket.disconnected) {
            console.error('当前未连接到服务器')
            ElMessage({
                message: '当前未连接到服务器',
                type: 'error',
                showClose: true
            })
            return
        }
        await createMedia()
        initPeer()
        initPeerTrackAndICE()
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return
        const offer = await peer.createOffer()
        socket.emit('CREATE_ROOM', socket.id, offer)
    }

    const joinRoomDialogVisible = ref<boolean>(false)
    const joinRoomDialogFormRef = ref()
    const joinRoomDialogForm = reactive({
        roomId: ''
    })
    /**
     * 申请加入房间弹窗
     * */
    const joinRoom = () => {
        if (socket.disconnected) {
            console.error('当前未连接到服务器')
            ElMessage({
                message: '当前未连接到服务器',
                type: 'error',
                showClose: true
            })
            return
        }
        joinRoomDialogVisible.value = true
    }
    /**
     * 申请加入房间弹窗关闭前触发
     * */
    const joinRoomDialogHandleClose = () => {
        joinRoomDialogVisible.value = false
        if (!joinRoomDialogFormRef.value) return
        joinRoomDialogFormRef.value.resetFields()
    }
    /**
     * 申请加入房间弹窗提交
     * */
    const joinRoomDialogHandleSubmit = () => {
        joinRoomDialogFormRef.value.validate((valid: boolean) => {
            if (valid) {
                socket.emit('APPLY_JOIN_ROOM', socket.id, joinRoomDialogForm.roomId)
            }
        })
    }

    /**
     * 离开房间
     * */
    const leaveRoom = () => {
        if (socket.disconnected) {
            console.error('leaveRoom 通道已关闭')
            return
        }
        socket.emit('APPLY_LEAVE_ROOM', socket.id, myChatVideoInfo.roomId)
        peerClose()
    }

    return {
        myVideoChatRef,
        otherVideoChatRef,
        joinRoomDialogFormRef,
        myChatVideoInfo,
        joinRoomDialogVisible,
        joinRoomDialogForm,
        createRoom,
        joinRoom,
        leaveRoom,
        joinRoomDialogHandleClose,
        joinRoomDialogHandleSubmit,
        initSocketConnect,
    }
}
