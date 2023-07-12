<template>
  <div class="menu-collapse-action">
    <el-icon size="22px" v-show="isCollapse" @click="isCollapse = !isCollapse"><Expand /></el-icon>
    <el-icon size="22px" v-show="!isCollapse" @click="isCollapse = !isCollapse"><Fold /></el-icon>
  </div>
  <el-menu
      background-color="#304156"
      text-color="#FFFFFF"
      active-text-color="#409eff"
      :default-active="isDefaultActive"
      class="menu-container"
      :collapse="isCollapse"
      @select="handleSelect"
  >
    <el-menu-item index="/home">
      <el-icon><icon-menu /></el-icon>
      <template #title>聊天室</template>
    </el-menu-item>
    <el-menu-item index="/about">
      <el-icon><document /></el-icon>
      <template #title>关于</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Expand,
  Fold,
} from '@element-plus/icons-vue'
import MenuContainerVertical from "@/hooks/menuContainerVertical";

const {
  isCollapse,
  isDefaultActive,
  handleSelect,
} = MenuContainerVertical()
</script>

<style scoped lang="scss">
.menu-collapse-action {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  background-color: #304156;
  color: #ffffff;

  &>.el-icon {
    cursor: pointer;
  }
}
.menu-container {
  height: calc(100% - 40px);
  border-right: 0;
}
.menu-container:not(.el-menu--collapse) {
  width: 200px;
}
</style>
