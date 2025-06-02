export interface IUsuarioLogin {
    email: string,
    contrasena: string,
    direccion?: string | null,
    nombre?: string,
    apellido?: string,
    rolId?: number,
}