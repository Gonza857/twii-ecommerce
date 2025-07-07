import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Clasificacion {
  id: number;
  nombre: string;
}

export interface ClasificacionDto {
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})

export class ClasificacionService {
  private apiUrl: string = "http://localhost:3000/api/clasificacion";
  private readonly http: HttpClient = inject(HttpClient);

  obtenerClasificaciones(): Observable<Clasificacion[]> {
    return this.http.get<Clasificacion[]>(`${this.apiUrl}`);
  }

  crearClasificacion(data: { nombre: string }): Observable<Clasificacion> {
    return this.http.post<Clasificacion>(this.apiUrl, data);
  }

  actualizarClasificacion(id: number, data: { nombre: string }): Observable<Clasificacion> {
    return this.http.put<Clasificacion>(`${this.apiUrl}/${id}`, data);
  }

  eliminarClasificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

