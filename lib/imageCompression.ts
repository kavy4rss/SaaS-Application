import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp', // Optimizing for web
    };

    try {
        const compressedFile = await imageCompression(file, options);
        // Preserves original names unless it strictly converts format, 
        // but ensures webp output logic defaults.
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
};
