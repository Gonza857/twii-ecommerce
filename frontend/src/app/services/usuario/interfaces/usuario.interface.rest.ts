export interface UsuarioLoginRest {
  email: string;
  contrasena: string;
}

export interface UsuarioRest {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion: string | null;
  rol: {
    id: number;
    nombre: string;
  };
  validado: boolean | null;
}

export interface UsuarioRecuperarRest {
  contrasena: string;
  token: string;
}
