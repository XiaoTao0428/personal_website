<template>
  <div class="action" style="height: 60px;">
    <el-button type="primary" v-if="!myChatVideoInfo.roomId" @click="createRoom">创建房间</el-button>
    <el-button type="primary" v-if="!myChatVideoInfo.roomId" @click="joinRoom">加入房间</el-button>
    <el-button type="primary" v-if="myChatVideoInfo.roomId" @click="leaveRoom">离开房间</el-button>
  </div>
  <div class="chat-room-container">
    <div class="chat-video-box">
      <video ref="myVideoChatRef" class="chat-video my-chat-video" autoplay></video>
    </div>
    <div class="chat-video-box">
      <video ref="otherVideoChatRef" class="chat-video other-chat-video" autoplay crossOrigin="anonymous"></video>
    </div>
<!--  TODO 1对多模式  -->
<!--    <template v-if="otherVideoChatIds.length > 0">-->
<!--      <div class="chat-video-box" v-for="(item, key) in otherVideoChatIds" :key="item.domId">-->
<!--        <video :id="'otherVideoChatId-' + item.domId" width="300" class="chat-video other-chat-video" autoplay></video>-->
<!--      </div>-->
<!--    </template>-->

    <el-dialog
        v-model="joinRoomDialogVisible"
        title="请输入房间号"
        width="300px"
        :before-close="joinRoomDialogHandleClose"
    >
      <el-form
          ref="joinRoomDialogFormRef"
          :model="joinRoomDialogForm"
          :rules="joinRoomDialogFormRule"
          label-width="0"
      >
        <el-form-item label="" prop="roomId">
          <el-input v-model="joinRoomDialogForm.roomId" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="joinRoomDialogHandleClose">取 消</el-button>
        <el-button type="primary" @click="joinRoomDialogHandleSubmit">确 定</el-button>
      </span>
      </template>
    </el-dialog>

  </div>

</template>

<script setup lang="ts">
import Home from "@/hooks/Home";
import { joinRoomFormRule } from "@/rules/HomeRules";

const {
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
} = Home()

const joinRoomDialogFormRule = joinRoomFormRule(joinRoomDialogFormRef, joinRoomDialogForm)

// 页面创建时初始化
initSocketConnect()

</script>

<style scoped lang="scss">
.chat-room-container {
  height: calc(100% - 60px);
  background-color: #2c3e50;
  display: flex;

  .chat-video-box {
    width: 50%;
    padding: 20px 20px;
    display: flex;
    justify-content: space-around;

    .chat-video {
      width: 100%;
      background-color: #ffffff;
    }
  }
}
</style>
