export interface Usuario {
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

export interface UsuarioLogin {
  email: string;
  contrasena: string;
}

export interface UsuarioRegister {
  email: string;
  nombre: string;
  contrasena: string;
  cContrasena: string;
  apellido: string;
  direccion: string | null;
}

export interface UsuarioRecuperar {
  contrasena: string,
  token: string,
}

export interface EstadisticasUsuario {
  usuariosTotales: number,
  usuariosValidados: number,
  usuariosSinValidar: number,
}
