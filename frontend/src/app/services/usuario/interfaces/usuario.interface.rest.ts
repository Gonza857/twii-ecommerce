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

export interface UsuarioRegisterRest {
  email: string;
  nombre: string;
  contrasena: string;
  cContrasena: string;
  apellido: string;
  direccion: string | null;
}

export interface UsuarioRecuperarRest {
  contrasena: string;
  token: string;
}

export interface EstadisticasUsuarioRest {
  usuariosTotales: number,
  usuariosValidados: number,
  usuariosSinValidar: number,
}

