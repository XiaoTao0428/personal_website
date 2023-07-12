<template>
  <el-form
      ref="loginFormRef"
      :model="loginForm"
      status-icon
      :rules="rules"
      label-width="80px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="loginForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="loginForm.password" type="password" show-password></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import LoginFormRule from "@/rules/loginFormRule";
import LoginForm from "@/hooks/loginForm";

const { loginFormRef, loginForm, submitForm, resetForm } = LoginForm()

const { rules } = LoginFormRule(loginFormRef, loginForm)

defineExpose({
  resetForm,
  submitForm
})
</script>

<style scoped lang="scss">

</style>
