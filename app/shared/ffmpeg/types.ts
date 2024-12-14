export interface FFmpegOptions {
    videoPath: string;
    subtitlePath: string;
    fontPath: string;
    logoPath: string;
}

export interface FFmpegResult {
    success: boolean;
    outputPath?: string;
    error?: string;
}