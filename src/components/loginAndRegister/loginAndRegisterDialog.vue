<template>
  <el-dialog
      v-model="loginDialogVisible"
      title="登录"
      width="500px"
      :before-close="handleClose"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header" :id="titleId" :class="titleClass">
        <el-radio-group v-model="activeTabName" @change="handleClickTab">
          <el-radio-button label="login">登录</el-radio-button>
          <el-radio-button label="register">注册</el-radio-button>
        </el-radio-group>
      </div>
    </template>
    <div class="dialog-content">
      <login-form v-show="activeTabName === 'login'" ref="loginFromRef"></login-form>
      <register-form v-show="activeTabName === 'register'" ref="registerFromRef"></register-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-show="activeTabName === 'login'" type="primary" @click="handleLoginSubmit" :loading="loginBtnLoading">登 录</el-button>
        <el-button v-show="activeTabName === 'register'" type="primary" @click="handleRegisterSubmit" :loading="registerBtnLoading">注 册</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import LoginDialog from "@/hooks/loginAndRegisterDialog";
import type { IntLoginDialog, EventLoginDialog } from "@/type/loginAndRegisterDialog";
import LoginForm from "@/components/loginAndRegister/loginForm.vue";
import RegisterForm from "@/components/loginAndRegister/registerForm.vue";

const props = withDefaults(defineProps<IntLoginDialog>(), {
  dialogVisible: false
})
const emits = defineEmits<EventLoginDialog>()

const {
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
} = LoginDialog(props, emits)
</script>

<style scoped lang="scss">
.dialog-header {
  display: flex;
}
.dialog-content {
}
.dialog-footer {
  button:first-child {
    margin-right: 10px;
  }
}
</style>
