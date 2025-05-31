import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string = "http://localhost:3000/api/usuario";
  private readonly http: HttpClient = inject(HttpClient);

  testearAPI (): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}`);
  }


}
