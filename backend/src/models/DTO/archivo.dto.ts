export interface ArchivoDTO {
    originalname: string;
    mimetype: string;
    size: number;
    path?: string;     // solo en diskStorage
    buffer?: Buffer;   // solo en memoryStorage
}