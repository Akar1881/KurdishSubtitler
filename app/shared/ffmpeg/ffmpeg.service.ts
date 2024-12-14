import { FFmpeg } from 'nativescript-ffmpeg-plugin-fixed';
import { FFmpegOptions, FFmpegResult } from './types';
import { StorageService } from '../storage/storage.service';

export class FFmpegService {
    static async burnSubtitles(options: FFmpegOptions): Promise<FFmpegResult> {
        const outputFile = StorageService.getOutputFilePath();
        const command = this.buildFFmpegCommand(options, outputFile);

        try {
            await FFmpeg.execute(command);
            return {
                success: true,
                outputPath: outputFile
            };
        } catch (error) {
            return {
                success: false,
                error: error.toString()
            };
        }
    }

    private static buildFFmpegCommand(options: FFmpegOptions, outputFile: string): string {
        return `-i "${options.videoPath}" -i "${options.logoPath}" ` +
               `-filter_complex "[1:v]scale=636:125[logo];[0:v][logo]overlay=10:10[subt];` +
               `[subt]subtitles='${options.subtitlePath}':force_style='FontName=CustomFont,` +
               `FontFile=${options.fontPath},BorderStyle=1,Outline=1,OutlineColor=&H000000,` +
               `Background=&H00000000'" -c:a copy "${outputFile}"`;
    }
}