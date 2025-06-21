import {inject, Injectable, OnInit, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import {UsuarioLoginRest, UsuarioRest} from './interfaces/usuario.interface.rest';
import UsuarioMapper from './mapping/usuario.mapper';
import {Usuario} from './interfaces/usuario.interface';

interface algo {
  exito?: boolean,
  mensaje?: string,
  data?: any
}

type ResultadoRequest = {
  mensaje?: string,
  codigo?: number,
  exito?: boolean,
  redireccion?: boolean,
  data?: any,
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string = "http://localhost:3000/api";
  private apiAuthUrl: string = "http://localhost:3000/api/auth";
  private readonly http: HttpClient = inject(HttpClient);

  private usuarioSignal = signal<Usuario | null>(null);
  public readonly usuario = this.usuarioSignal.asReadonly();

  private respuestaLoginSignal = signal<ResultadoRequest | null>(null);
  public readonly resultadoLogin = this.respuestaLoginSignal.asReadonly();

  public testearAPI(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}`);
  }

  public iniciarSesion(datos: UsuarioLoginRest): void {
    console.log("LOGIN: iniciando", datos)
    const credenciales = {
      withCredentials: true
    }
    this.http.post<boolean>(`${this.apiAuthUrl}/login`, datos, credenciales)
      .subscribe({
        next: () => {
          this.respuestaLoginSignal.set({exito: true})
        },
        error: (e: any) => {
          if (e.status === 403) {
            this.respuestaLoginSignal.set(
              {
                exito: false,
                mensaje: e.error.error,
                codigo: e.status,
                redireccion: true,
              }
            )
          } else if (e.status === 400 || e.status === 401) {
            this.respuestaLoginSignal.set(
              {
                exito: false,
                mensaje: e.error.error,
                codigo: e.status,
                redireccion: false,
              }
            )
          }
        },
        complete: () => {
        }
      });
  }

  public cerrarSesion() {
    const credenciales = {
      withCredentials: true
    }
    this.http.get<boolean>(`${this.apiAuthUrl}/cerrar-sesion`, credenciales)
      .subscribe({
        next: () => {
        },
        error: () => {
        },
        complete: () => {
        }
      })
  }

  public obtenerUsuarioActual(): void {
    const credenciales = {
      withCredentials: true
    }
    this.http.get<UsuarioRest>(`${this.apiAuthUrl}/validar`, credenciales)
      .subscribe({
        next: (usuarioRest: UsuarioRest) => {
          this.usuarioSignal.set(UsuarioMapper.mapUsuarioRestToUsuario(usuarioRest))
        },
        error: (error: any) => {
          if (error.status === 404) {
            this.usuarioSignal.set(null);
          }
        }
      })
  }

  public reenviarCorreo(id: number): Observable<algo> {
    return this.http.get(`${this.apiAuthUrl}/reenviar-confirmacion/${id}`)
  }

  public confirmarCuenta(token: string): Observable<algo> {
    return this.http.get(`${this.apiAuthUrl}/confirmar-cuenta/${token}`)
  }

  public registrarse(datos: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiAuthUrl}/register`, datos);
  }

  public recuperar(email: string): Observable<algo> {
    return this.http.post<algo>(`${this.apiAuthUrl}/recuperar`, {email});
  }

  public cambiarContrasena(datos: any): Observable<algo> {
    return this.http.post<algo>(`${this.apiAuthUrl}/cambiar`, datos);
  }


  public obtenerUsuarios(): Observable<algo> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.get<algo>(`${this.apiUrl}/usuarios`, credenciales);
  }


}
