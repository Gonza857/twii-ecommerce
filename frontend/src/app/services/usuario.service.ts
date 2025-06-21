import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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

  public iniciarSesion(datos: any): Observable<boolean> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.post<boolean>(`${this.apiAuthUrl}/login`, datos, credenciales);
  }

  public reenviarCorreo(id: number): Observable<algo> {
    return this.http.get(`${this.apiAuthUrl}/reenviar-confirmacion/${id}`)
  }

  public confirmarCuenta (token: string): Observable<algo> {
    return this.http.get(`${this.apiAuthUrl}/confirmar-cuenta/${token}`)
  }

  public registrarse (datos: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiAuthUrl}/register`, datos);
  }

  public recuperar (email: string): Observable<algo> {
    return this.http.post<algo>(`${this.apiAuthUrl}/recuperar`, {email});
  }

  public cambiarContrasena (datos: any): Observable<algo> {
    return this.http.post<algo>(`${this.apiAuthUrl}/cambiar`, datos);
  }

  public obtenerUsuarioActual (): Observable<Usuario> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.get<Usuario>(`${this.apiAuthUrl}/validar`, credenciales);
  }

  public obtenerUsuarios (): Observable<algo> {
    const credenciales = {
      withCredentials: true
    }
    return this.http.get<algo>(`${this.apiUrl}/usuarios`, credenciales);
  }




}
