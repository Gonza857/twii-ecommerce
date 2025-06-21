import {UsuarioLoginRest, UsuarioRest} from '../interfaces/usuario.interface.rest';
import {Usuario, UsuarioLogin} from '../interfaces/usuario.interface';

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

}

export default UsuarioMapper;
