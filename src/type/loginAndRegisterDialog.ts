interface IntLoginDialog {
    dialogVisible: boolean,
}

interface EventLoginDialog {
    (e: 'update:dialogVisible', newValue: boolean): void,
}

export type {
    IntLoginDialog,
    EventLoginDialog
}
