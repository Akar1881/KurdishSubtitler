import { Observable } from '@nativescript/core';
import { FilePickerService } from '../shared/file-picker/file-picker.service';
import { FFmpegService } from '../shared/ffmpeg/ffmpeg.service';
import { StorageService } from '../shared/storage/storage.service';
import { FileSelection, ProcessingState } from './types';

export class MainViewModel extends Observable {
    private fileSelections: Record<string, string> = {
        video: '',
        subtitle: '',
        font: '',
        logo: ''
    };

    private processingState: ProcessingState = {
        isProcessing: false,
        status: ''
    };

    constructor() {
        super();
        StorageService.setupOutputDirectory();
    }

    get selectedVideo(): string { return this.fileSelections.video; }
    get selectedSubtitle(): string { return this.fileSelections.subtitle; }
    get selectedFont(): string { return this.fileSelections.font; }
    get selectedLogo(): string { return this.fileSelections.logo; }
    get isProcessing(): boolean { return this.processingState.isProcessing; }
    get processingStatus(): string { return this.processingState.status; }
    
    get canStartBurning(): boolean {
        return Object.values(this.fileSelections).every(Boolean) && !this.processingState.isProcessing;
    }

    private async selectFile(type: FileSelection['type'], extensions: string[]): Promise<void> {
        try {
            const result = await FilePickerService.pickFile({ 
                extensions: extensions.map(ext => `.${ext}`)
            });
            
            if (result.filePath) {
                this.fileSelections[type] = result.filePath;
                this.notifyPropertyChange(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`, result.filePath);
                this.notifyPropertyChange('canStartBurning', this.canStartBurning);
            } else if (result.error) {
                console.error(`Error selecting ${type}:`, result.error);
            }
        } catch (error) {
            console.error(`Error in selectFile for ${type}:`, error);
        }
    }

    async onSelectVideo() {
        await this.selectFile('video', ['mp4']);
    }

    async onSelectSubtitle() {
        await this.selectFile('subtitle', ['vtt']);
    }

    async onSelectFont() {
        await this.selectFile('font', ['ttf']);
    }

    async onSelectLogo() {
        await this.selectFile('logo', ['png']);
    }

    async onStartBurning() {
        if (!this.canStartBurning) return;

        this.updateProcessingState(true, 'Processing video...');

        const result = await FFmpegService.burnSubtitles({
            videoPath: this.fileSelections.video,
            subtitlePath: this.fileSelections.subtitle,
            fontPath: this.fileSelections.font,
            logoPath: this.fileSelections.logo
        });

        this.updateProcessingState(
            false,
            result.success
                ? `Video processed successfully!\nSaved to: ${result.outputPath}`
                : `Error processing video: ${result.error}`
        );
    }

    private updateProcessingState(isProcessing: boolean, status: string): void {
        this.processingState = { isProcessing, status };
        this.notifyPropertyChange('isProcessing', isProcessing);
        this.notifyPropertyChange('processingStatus', status);
    }
}