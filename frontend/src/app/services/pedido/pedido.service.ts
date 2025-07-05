import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { map, type Observable } from "rxjs"
import type { PedidoRest } from "./interfaces/pedido.interface.rest"
import type { Pedido } from "./interfaces/pedido.interface"
import PedidoMapper from "./mapping/pedido.mapper"
import type { CarritoProducto } from "../carrito/interfaces/carrito.interface"

type RespuestaServer = {
  isLoading: boolean
  error: string | null
}

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private apiUrl = "http://localhost:3000/api/pedidos"
  private readonly http = inject(HttpClient)

  private signalPedidos = signal<Pedido[]>([])
  public pedidos = this.signalPedidos.asReadonly()

  private signalRespuestaServer = signal<RespuestaServer | null>(null)
  public respuestaServer = this.signalRespuestaServer.asReadonly()

  constructor() {}

  crearPedido(usuarioId: number, items: CarritoProducto[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { usuarioId, items })
  }

  public usuarioSinSesion(): void {
    this.signalRespuestaServer.set({
      isLoading: false,
      error: "Debes iniciar sesión para ver tus pedidos.",
    })
  }

  obtenerPedidosPorUsuario(usuarioId: number): void {
    this.signalRespuestaServer.set({ isLoading: true, error: null }) // Set loading state
    this.http
      .get<PedidoRest[]>(`${this.apiUrl}/usuario`)
      .pipe(map((res: PedidoRest[]) => PedidoMapper.mapToPedidosArray(res)))
      .subscribe({
        next: (res: Pedido[]) => {
          this.signalPedidos.set(res)
          this.signalRespuestaServer.set({
            isLoading: false,
            error: null,
          })
        },
        error: (e: any) => {
          console.log("ERROR al obtener pedidos por usuario", e)
          this.signalRespuestaServer.set({
            isLoading: false,
            error: "No se pudieron cargar tus pedidos. Intenta de nuevo más tarde.",
          })
        },
      })
  }

  obtenerTodosLosPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/admin`)
  }

  actualizarEstadoPedido(pedidoId: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pedidoId}/estado`, { estado })
  }

  // New method to cancel an order
  cancelarPedido(pedidoId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pedidoId}/cancelar`, {})
  }

  // New method to repeat an order
  repetirPedido(originalPedidoId: number): Observable<any> {
    // The backend will handle fetching the original order's products and creating a new one
    return this.http.post(`${this.apiUrl}/${originalPedidoId}/repetir`, {})
  }
}
