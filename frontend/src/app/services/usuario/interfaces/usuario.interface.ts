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

}

export interface UsuarioRecuperar {
  contrasena: string,
  token: string,
}

export interface UsuarioReenviarConfirmacion {

}
