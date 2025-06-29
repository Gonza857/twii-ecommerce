import { inject } from "@angular/core"
import { type CanActivateFn, Router } from "@angular/router"
import { UsuarioService } from "../services/usuario/usuario.service"
import { map, take } from "rxjs/operators"

export const authGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService)
  const router = inject(Router)

 
  return usuarioService.obtenerUsuarioActual().pipe(
    take(1),
    map(() => {
      const usuario = usuarioService.usuario()
      if (usuario) {
        return true 
      } else {
        router.navigate(["/cuenta/login"]) 
        return false
      }
    }),
  )
}
