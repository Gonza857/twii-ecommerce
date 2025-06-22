import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { map, type Observable } from "rxjs"
import type { Pedido } from "./interfaces/pedido.interface"
import type { PedidoRest, CrearPedidoRequestRest } from "./interfaces/pedido.interface.rest"
import PedidoMapper from "./mapping/pedido.mapper"

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private apiUrl = "http://localhost:3000/api/pedido"
  private readonly http: HttpClient = inject(HttpClient)

  public obtenerPedidosPorUsuario(usuarioId: number): Observable<Pedido[]> {
    console.log("[DEBUG] Obteniendo pedidos para usuario:", usuarioId)
    const credenciales = {
      withCredentials: true,
    }
    return this.http.get<PedidoRest[]>(`${this.apiUrl}/usuario/${usuarioId}`, credenciales).pipe(
      map((pedidos) => {
        console.log("[DEBUG] Pedidos recibidos del backend:", pedidos)
        return pedidos.map((pedido) => PedidoMapper.mapToPedido(pedido))
      }),
    )
  }

  public obtenerPedidoPorId(id: number): Observable<Pedido> {
    const credenciales = {
      withCredentials: true,
    }
    return this.http
      .get<PedidoRest>(`${this.apiUrl}/${id}`, credenciales)
      .pipe(map((pedido) => PedidoMapper.mapToPedido(pedido)))
  }

  public crearPedido(request: CrearPedidoRequestRest): Observable<{ id: number; mensaje: string }> {
    const credenciales = {
      withCredentials: true,
    }
    return this.http.post<{ id: number; mensaje: string }>(this.apiUrl, request, credenciales)
  }

  public actualizarEstadoPedido(id: number, estado: string): Observable<{ mensaje: string }> {
    const credenciales = {
      withCredentials: true,
    }
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, { estado }, credenciales)
  }
}
