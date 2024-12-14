export interface FileSelection {
    path: string;
    type: 'video' | 'subtitle' | 'font' | 'logo';
}

export interface ProcessingState {
    isProcessing: boolean;
    status: string;
}