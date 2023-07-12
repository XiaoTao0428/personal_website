import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 将获取环境的方法挂载到vue的原型上，方便后面的使用
app.config.globalProperties.getEnv = import.meta.env

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
