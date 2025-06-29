import {
  EstadisticasUsuarioRest,
  UsuarioLoginRest,
  UsuarioRecuperarRest,
  UsuarioRegisterRest,
  UsuarioRest
} from '../interfaces/usuario.interface.rest';
import {
  EstadisticasUsuario,
  Usuario,
  UsuarioLogin,
  UsuarioRecuperar,
  UsuarioRegister
} from '../interfaces/usuario.interface';

class UsuarioMapper {
  static mapLoginToLoginRest (usuarioRest: UsuarioLogin): UsuarioLoginRest {
    return {
      email: usuarioRest.email,
      contrasena: usuarioRest.contrasena,
    }
  }

  static mapToEstatisticas (eur: EstadisticasUsuarioRest): EstadisticasUsuario {
    return {
      usuariosSinValidar: eur.usuariosSinValidar,
      usuariosTotales: eur.usuariosTotales,
      usuariosValidados: eur.usuariosValidados,
    }
  }

  static mapUsuarioRestToUsuario (usuario: UsuarioRest): Usuario {
      return {
        email: usuario.email,
        apellido: usuario.apellido,
        direccion: usuario.direccion,
        rol: usuario.rol,
        nombre: usuario.nombre,
        validado: usuario.validado,
        id: usuario.id
      }
  }

  static mapUsuarioRecuperarToRest (usuarioRecuperar: UsuarioRecuperar): UsuarioRecuperarRest {
    return {
      contrasena: usuarioRecuperar.contrasena,
      token: usuarioRecuperar.token
    }
  }


}

export default UsuarioMapper;
