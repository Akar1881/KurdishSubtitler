import { Application, Device, alert } from '@nativescript/core';
import * as permissions from 'nativescript-permissions';
import { PermissionDialogOptions, PermissionResult } from './types';

export class PermissionsService {
    private static readonly STORAGE_PERMISSIONS = [
        android.Manifest.permission.READ_EXTERNAL_STORAGE,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE
    ];

    static async checkAllFilesAccess(): Promise<PermissionResult> {
        if (!this.needsAllFilesAccess()) {
            return this.checkBasicStoragePermissions();
        }

        const hasAccess = await this.hasAllFilesAccess();
        return {
            granted: hasAccess,
            shouldShowSettings: !hasAccess
        };
    }

    static async requestAllFilesAccess(): Promise<boolean> {
        if (!this.needsAllFilesAccess()) {
            const result = await this.checkBasicStoragePermissions();
            return result.granted;
        }

        const hasAccess = await this.hasAllFilesAccess();
        if (!hasAccess) {
            await this.showAllFilesAccessDialog();
            return this.hasAllFilesAccess();
        }
        return true;
    }

    static openSettings(): void {
        if (global.isAndroid) {
            const intent = new android.content.Intent();
            if (this.needsAllFilesAccess()) {
                intent.setAction(android.provider.Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                const uri = android.net.Uri.fromParts("package", Application.android.context.getPackageName(), null);
                intent.setData(uri);
            } else {
                intent.setAction(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                const uri = android.net.Uri.fromParts("package", Application.android.context.getPackageName(), null);
                intent.setData(uri);
            }
            Application.android.foregroundActivity.startActivity(intent);
        }
    }

    private static needsAllFilesAccess(): boolean {
        return global.isAndroid && Device.sdkVersion >= 30;
    }

    private static async hasAllFilesAccess(): Promise<boolean> {
        if (!global.isAndroid) return true;

        const Environment = android.os.Environment;
        return Environment.isExternalStorageManager();
    }

    private static async checkBasicStoragePermissions(): Promise<PermissionResult> {
        try {
            for (const permission of this.STORAGE_PERMISSIONS) {
                await permissions.requestPermission(permission);
            }
            return { granted: true, shouldShowSettings: false };
        } catch {
            return { granted: false, shouldShowSettings: true };
        }
    }

    private static async showAllFilesAccessDialog(): Promise<void> {
        const options: PermissionDialogOptions = {
            title: "Storage Permission Required",
            message: "Kurdish Subtitler needs access to all files to process videos and save the output. Please grant 'All Files Access' permission in the next screen.",
            okButtonText: "Open Settings",
            cancelButtonText: "Cancel"
        };

        const result = await alert(options);
        if (result) {
            this.openSettings();
        }
    }
}