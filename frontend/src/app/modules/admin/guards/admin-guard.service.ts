import {  Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {UsuarioService} from '../../../services/usuario/usuario.service';
import {Usuario} from '../../../services/usuario/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminGuardService implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {
    this.usuarioService.obtenerUsuarioActual()
  }

  canActivate(): boolean {
    const usuario: Usuario | null = this.usuarioService.usuario();
    if (usuario) {
      if (usuario?.rol?.id !== 1) {
        this.router.navigate(['/']);
        return false;
      } else return true;
    }
    return false;
  }
}
