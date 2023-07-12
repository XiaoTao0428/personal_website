<template>
  <el-form
      ref="registerFormRef"
      :model="registerForm"
      status-icon
      :rules="rules"
      label-width="80px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="registerForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="registerForm.password" type="password" show-password></el-input>
    </el-form-item>
    <el-form-item label="验证密码" prop="checkPassword">
      <el-input v-model="registerForm.checkPassword" type="password" show-password></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import RegisterFormRule from "@/rules/registerFormRule";
import RegisterForm from "@/hooks/registerForm";

const { registerFormRef, registerForm, submitForm, resetForm } = RegisterForm()

const { rules } = RegisterFormRule(registerFormRef, registerForm)

defineExpose({
  resetForm,
  submitForm
})
</script>

<style scoped lang="scss">

</style>
