import { Folder, knownFolders, path } from '@nativescript/core';
import { StorageOptions } from './types';

export class StorageService {
    private static readonly DEFAULT_OPTIONS: StorageOptions = {
        basePath: knownFolders.documents().path,
        folderName: "KurdishSubtitler/outputs"
    };

    static setupOutputDirectory(options: StorageOptions = this.DEFAULT_OPTIONS): void {
        const outputsDir = path.join(options.basePath, options.folderName);
        if (!Folder.exists(outputsDir)) {
            Folder.fromPath(outputsDir);
        }
    }

    static getOutputFilePath(options: StorageOptions = this.DEFAULT_OPTIONS): string {
        return path.join(
            options.basePath,
            options.folderName,
            `output_${Date.now()}.mp4`
        );
    }
}