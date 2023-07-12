<script setup lang="ts">
import MenuContainerVertical from "@/components/menuContainerVertical/menuContainerVertical.vue";
import HeaderContainer from "@/components/headerContainer/headerContainer.vue";
</script>

<template>
  <el-container class="outer-container">
    <el-aside width="auto">
      <menu-container-vertical></menu-container-vertical>
    </el-aside>
    <el-container class="inner-container">
      <el-header>
        <header-container></header-container>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.el-header {
  box-shadow: 0 2px 5px #242f42;
}
</style>
