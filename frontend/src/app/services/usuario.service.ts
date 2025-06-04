import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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
    return this.http.post<boolean>(`${this.apiAuthUrl}/login`, datos);
  }

  public registrarse (datos: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiAuthUrl}/register`, datos);
  }


}
