import { FilePickerResult, FilePickerOptions } from './types';
import { Mediafilepicker } from 'nativescript-mediafilepicker';

export class FilePickerService {
    static async pickFile(options: FilePickerOptions): Promise<FilePickerResult> {
        try {
            const picker = new Mediafilepicker();
            const result = await picker.openFilePicker({
                android: {
                    extensions: options.extensions,
                    maxNumberFiles: 1
                },
                ios: {
                    extensions: ['public.movie', 'public.text', 'public.image'],
                    multipleSelection: false
                }
            });

            if (!result?.files?.length) {
                return { filePath: null };
            }

            return {
                filePath: result.files[0]
            };
        } catch (error) {
            console.error('File picker error:', error);
            return {
                filePath: null,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
}