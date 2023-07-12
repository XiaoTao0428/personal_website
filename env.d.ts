/// <reference types="vite/client" />
declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module "element-plus";

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_NODE_ENV: string
    readonly VITE_APP_URL: string
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
