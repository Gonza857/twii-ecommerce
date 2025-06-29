import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { ItemCarrito } from "./carrito.service"
import type { Pedido } from "../modules/customer/pages/mis-pedidos/interfaces/pedido.interface"

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private apiUrl = "http://localhost:3000/api/pedidos"
  private readonly http = inject(HttpClient)

  constructor() {}

  crearPedido(usuarioId: number, items: ItemCarrito[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { usuarioId, items })
  }

  obtenerPedidosPorUsuario(usuarioId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/usuario`)
  }

  obtenerTodosLosPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/admin`)
  }

  actualizarEstadoPedido(pedidoId: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pedidoId}/estado`, { estado })
  }
}
