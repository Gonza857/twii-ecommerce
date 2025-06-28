import { inject, Injectable, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { map, type Observable, tap } from "rxjs" // Import tap
import type { UsuarioLoginRest, UsuarioRecuperarRest, UsuarioRest } from "./interfaces/usuario.interface.rest"
import UsuarioMapper from "./mapping/usuario.mapper"
import type { Usuario, UsuarioRegister } from "./interfaces/usuario.interface"

interface algo {
  exito?: boolean
  mensaje?: string
  data?: any
}

type ResultadoRequest = {
  mensaje?: string
  codigo?: number
  exito?: boolean
  redireccion?: boolean
  data?: any
}

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiUrl = "http://localhost:3000/api"
  private apiAuthUrl = "http://localhost:3000/api/auth"
  private readonly http: HttpClient = inject(HttpClient)

  private usuarioSignal = signal<Usuario | null>(null)
  public readonly usuario = this.usuarioSignal.asReadonly()

  private respuestaServidorSignal = signal<ResultadoRequest | null>(null)
  public readonly respuestaServidor = this.respuestaServidorSignal.asReadonly()

  public iniciarSesion(datos: UsuarioLoginRest): void {
    const credenciales = {
      withCredentials: true,
    }
    this.http.post<boolean>(`${this.apiAuthUrl}/login`, datos, credenciales).subscribe({
      next: () => {
        this.respuestaServidorSignal.set({ exito: true })
      },
      error: (e: any) => {
        if (e.status === 403) {
          this.respuestaServidorSignal.set({
            exito: false,
            mensaje: e.error.error,
            codigo: e.status,
            redireccion: true,
            data: e.error.data,
          })
        } else if (e.status === 400 || e.status === 401) {
          this.respuestaServidorSignal.set({
            exito: false,
            mensaje: e.error.error,
            codigo: e.status,
            redireccion: false,
          })
        }
      },
      complete: () => {},
    })
  }

  public cerrarSesion() {
    const credenciales = {
      withCredentials: true,
    }
    this.http.get<boolean>(`${this.apiAuthUrl}/cerrar-sesion`, credenciales).subscribe({
      next: (res: any) => {
        this.usuarioSignal.set(null)
      },
      error: () => {},
      complete: () => {},
    })
  }

  public obtenerUsuarioActual(): Observable<Usuario | null> {
    const credenciales = {
      withCredentials: true,
    }
    return this.http.get<UsuarioRest>(`${this.apiAuthUrl}/validar`, credenciales).pipe(
      map((usuarioRest: UsuarioRest) => UsuarioMapper.mapUsuarioRestToUsuario(usuarioRest)),
      tap((usuario: Usuario) => {
        this.usuarioSignal.set(usuario)
      }),
      // Handle 404 specifically if needed, or let the error propagate
      // catchError((error: any) => {
      //   if (error.status === 404) {
      //     this.usuarioSignal.set(null);
      //   }
      //   return throwError(() => error);
      // })
    )
  }

  public reenviarCorreo(id: number): void {
    this.http.get<{ mensaje: string }>(`${this.apiAuthUrl}/reenviar-confirmacion/${id}`).subscribe({
      next: (res: { mensaje: string }) => {
        this.respuestaServidorSignal.set({
          exito: true,
          mensaje: res.mensaje,
        })
      },
      error: (e: any) => {
        this.respuestaServidorSignal.set({
          exito: false,
          codigo: e.status,
          mensaje: e.error.error,
        })
      },
    })
  }

  public confirmarCuenta(token: string): void {
    this.http.get(`${this.apiAuthUrl}/confirmar-cuenta/${token}`).subscribe({
      next: () => {
        this.respuestaServidorSignal.set({
          exito: true,
        })
      },
      error: (e: any) => {
        this.respuestaServidorSignal.set({
          exito: false,
          mensaje: e.error.error,
          redireccion: false,
          codigo: e.status,
        })
      },
    })
  }

  public registrarse(usuarioRegister: UsuarioRegister): void {
    this.http.post<{ mensaje: string }>(`${this.apiAuthUrl}/register`, usuarioRegister).subscribe({
      next: (res: { mensaje: string }) => {
        this.respuestaServidorSignal.set({
          exito: true,
          mensaje: res.mensaje,
        })
      },
      error: (e: any) => {
        this.respuestaServidorSignal.set({
          exito: false,
          mensaje: e.error.error,
          redireccion: false,
        })
      },
    })
  }

  public recuperar(email: string): void {
    this.http.post<{ mensaje: string }>(`${this.apiAuthUrl}/recuperar`, { email }).subscribe({
      next: (res: { mensaje: string }) => {
        this.respuestaServidorSignal.set({
          exito: true,
          mensaje: res.mensaje,
        })
      },
      error: (e: any) => {
        this.respuestaServidorSignal.set({
          exito: false,
          mensaje: e.error.error,
        })
      },
    })
  }

  public cambiarContrasena(datos: UsuarioRecuperarRest): void {
    this.http.post<{ mensaje: string }>(`${this.apiAuthUrl}/cambiar`, datos).subscribe({
      next: (res: { mensaje: string }) => {
        this.respuestaServidorSignal.set({
          exito: true,
          mensaje: res.mensaje,
        })
      },
      error: (e: any) => {
        this.respuestaServidorSignal.set({
          exito: false,
          mensaje: e.error.error,
          codigo: e.status,
          redireccion: false,
        })
      },
    })
  }

  public obtenerUsuarios(): Observable<algo> {
    const credenciales = {
      withCredentials: true,
    }
    return this.http.get<algo>(`${this.apiUrl}/usuarios`, credenciales)
  }

  public limpiarRespuesta() {
    this.respuestaServidorSignal.set(null)
  }
}
