import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {UsuarioLoginRest, UsuarioRest} from './interfaces/usuario.interface.rest';
import UsuarioMapper from './mapping/usuario.mapper';

interface algo {
  exito?: boolean,
  mensaje?: string,
  data?: any
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  validado: boolean;
  rolid: number;
  rol: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string = "http://localhost:3000/api";
  private apiAuthUrl: string = "http://localhost:3000/api/auth";
  private readonly http: HttpClient = inject(HttpClient);

  public testearAPI(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}`);
  }

  public iniciarSesion(datos: UsuarioLoginRest): Observable<boolean> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.post<boolean>(`${this.apiAuthUrl}/login`, datos, credenciales);
  }

  public cerrarSesion(): Observable<boolean> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.get<boolean>(`${this.apiAuthUrl}/cerrar-sesion`, credenciales)
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

  public obtenerUsuarioActual(): Observable<UsuarioRest> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.get<UsuarioRest>(`${this.apiAuthUrl}/validar`, credenciales)
      .pipe(
        map((res: UsuarioRest) => UsuarioMapper.mapUsuarioRestToUsuario(res))
      );
  }

  public obtenerUsuarios(): Observable<algo> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.get<algo>(`${this.apiUrl}/usuarios`, credenciales);
  }


}
