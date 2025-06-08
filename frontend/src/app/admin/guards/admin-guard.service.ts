import {inject, Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UsuarioService} from '../../services/usuario.service';
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {
  constructor(
      private usuarioService: UsuarioService,
      private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.usuarioService.obtenerUsuarioActual().pipe(
        map((data: any) => {
          if (data?.rol?.id === 1) {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        }),
        catchError(error => {
          console.error(error);
          this.router.navigate(['/']);
          return of(false);
        })
    );
  }
}
