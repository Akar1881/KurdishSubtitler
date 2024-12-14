export interface PermissionDialogOptions {
    title: string;
    message: string;
    okButtonText: string;
    cancelButtonText: string;
}

export interface PermissionResult {
    granted: boolean;
    shouldShowSettings: boolean;
}