<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <div class="grid-content">
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content" v-if="loginStatus === 0">
        <div class="avatar-box" @click="handleLogin">
          <el-avatar :size="40"> 登录 </el-avatar>
<!--          <el-icon><CaretBottom /></el-icon>-->
        </div>
      </div>
      <div class="grid-content" v-if="loginStatus === 1">
        <el-popover
            popper-class="avatar-popper"
            placement="bottom-end"
            :width="150"
            trigger="hover"
            :show-arrow="false"
            :show-after="100"
            :teleported="false"
            :offset="0"
            ref="popoverRef"
            :virtual-triggering="true"
            :virtual-ref="popoverShowRef"
        >
          <template #default>
            <div class="avatar-popper-content">
              <ul>
                <li @click="handleLogout">退出{{ loginStatus }}</li>
              </ul>
            </div>
          </template>
        </el-popover>
        <div class="avatar-box" ref="popoverShowRef">
          <el-avatar :size="40" :icon="MyIcon" :src="avatarUrl" />
          <el-icon><CaretBottom /></el-icon>
        </div>
      </div>
    </el-col>
  </el-row>
  <login-and-register-dialog v-model:dialog-visible="loginDialogVisible"></login-and-register-dialog>
</template>

<script setup lang="ts">
import { CaretBottom } from "@element-plus/icons-vue";
import HeaderContainer from "@/hooks/headerContainer";
import LoginAndRegisterDialog from "@/components/loginAndRegister/loginAndRegisterDialog.vue";

const {
  MyIcon,
  avatarUrl,
  popoverShowRef,
  popoverRef,
  loginStatus,
  loginDialogVisible,
  handleLogin,
  handleLogout
} = HeaderContainer()
</script>

<style scoped lang="scss">
.el-row {
  height: 100%;

  .el-col:last-child {

    .grid-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: right;

      &:deep(.avatar-popper)  {
        border-top-right-radius: 0;
        z-index: 90 !important;
        padding: 10px 0;

        .avatar-popper-content {

          ul {
            padding: 0;
            margin: 0;
            list-style: none;

            li {
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #ecf5ff;
              cursor: pointer;

              &:hover {
                background-color: #d9ecff;
                color: #409eff;
              }
            }
          }
        }
      }

      &:deep(.avatar-popper:hover)  {
        &+.avatar-box {
          //background-color: var(--el-border-color-light);
          background-color: #242f42;
          color: #ffffff;
        }
      }

      .avatar-box {
        height: 100%;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        z-index: 99;

        &:hover {
          background-color: #242f42;
          color: #ffffff;
        }

        .el-icon {
          margin-left: 2px;
        }
      }
    }
  }
}

</style>
