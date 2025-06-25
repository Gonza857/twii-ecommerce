import {z} from "zod";

export const productoSchema = z.object({
    nombre: z.string(),
    clasificacion: z.string(),
    descripcion: z.string(),
    precio: z.string(),
    imagen: z.string().nullable().optional()
});

export const productoEditarSchema = z.object({
    nombre: z.string(),
    clasificacion: z.string(),
    descripcion: z.string(),
    precio: z.string(),
    imagen: z.string().nullable().optional(),
    cambioImagen: z.string().transform(val => val === 'true')
});

export const imagenProductoSchema = z.object({
    mimetype: z
        .string()
        .refine((val) => val.startsWith('image/'), {
            message: 'El archivo debe ser una imagen',
        }),
    size: z
        .number()
        .max(2 * 1024 * 1024, { message: 'La imagen no debe superar los 2MB' }),
    buffer: z
        .instanceof(Buffer, { message: 'El archivo no tiene contenido válido' }),
})

