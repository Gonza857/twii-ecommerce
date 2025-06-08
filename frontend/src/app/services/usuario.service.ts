import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface algo {
  exito?: boolean,
  mensaje?: string,
  data?: any
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string = "http://localhost:3000/api/usuario";
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

  public registrarse (datos: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiAuthUrl}/register`, datos);
  }

  public recuperar (email: string): Observable<algo> {
    return this.http.post<algo>(`${this.apiAuthUrl}/recuperar`, {email});
  }

  public cambiarContrasena (datos: any): Observable<algo> {
    console.log("le pego a", `${this.apiAuthUrl}/cambiar`)
    return this.http.post<algo>(`${this.apiAuthUrl}/cambiar`, datos);
  }



}
