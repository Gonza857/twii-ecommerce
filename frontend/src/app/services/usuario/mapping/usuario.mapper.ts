import {UsuarioLoginRest, UsuarioRecuperarRest, UsuarioRest} from '../interfaces/usuario.interface.rest';
import {Usuario, UsuarioLogin, UsuarioRecuperar} from '../interfaces/usuario.interface';

class UsuarioMapper {
  static mapLoginToLoginRest (usuarioRest: UsuarioLogin): UsuarioLoginRest {
    return {
      email: usuarioRest.email,
      contrasena: usuarioRest.contrasena,
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

  static mapUsuarioToUsuarioRest (usuarioRest: UsuarioRest): Usuario {
    return {
      email: usuarioRest.email,
      apellido: usuarioRest.apellido,
      direccion: usuarioRest.direccion,
      rol: usuarioRest.rol,
      nombre: usuarioRest.nombre,
      validado: usuarioRest.validado,
      id: usuarioRest.id
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
