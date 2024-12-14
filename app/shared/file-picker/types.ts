export interface FilePickerResult {
    filePath: string | null;
    error?: string;
}

export interface FilePickerOptions {
    extensions: string[];
    title?: string;
}