import {UsuarioLoginRest} from '../interfaces/usuario.interface.rest';
import { UsuarioLogin} from '../interfaces/usuario.interface';

class UsuarioMapper {
  static mapLoginToLoginRest (usuarioRest: UsuarioLogin): UsuarioLoginRest {
    return {
      email: usuarioRest.email,
      password: usuarioRest.password,
    }
  }

  // static mapUsuarioToUsuarioRest (usuario: Usuario): UsuarioRest {
  //
  // }

}

export default UsuarioMapper;
