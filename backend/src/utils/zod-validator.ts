import { ZodSchema, ZodTypeAny, ZodObject } from 'zod';

type ValidateOptions = {
    partial?: boolean;
};

export function validate<T extends ZodTypeAny>(
    schema: T,
    input: unknown,
    options?: ValidateOptions
) {
    const effectiveSchema = options?.partial
        ? (schema instanceof ZodObject ? schema.partial() : schema)
        : schema;

    const result = effectiveSchema.safeParse(input);

    if (!result.success) {
        // Podés customizar el error, loguear o tirar un error HTTP
        throw new Error(JSON.stringify(result.error.format()));
    }

    return result.data;
}
