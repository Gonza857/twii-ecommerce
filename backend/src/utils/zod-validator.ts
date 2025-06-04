import {ZodSchema, ZodTypeAny, ZodObject, ZodError} from 'zod';

type ValidateOptions = {
    partial?: boolean;
};

export function validate<T extends ZodTypeAny>(
    schema: T,
    data: unknown
): ReturnType<T["parse"]> {
    try {
        return schema.parse(data);
    } catch (e) {
        if (e instanceof ZodError) {
            throw new Error("Error de validación de datos.");
        }
        throw e;
    }
}