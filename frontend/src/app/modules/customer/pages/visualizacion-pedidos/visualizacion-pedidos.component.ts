import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { BadgeModule } from "primeng/badge"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { PedidoService } from "../../../../services/pedido/pedido.service"
import { UsuarioService } from "../../../../services/usuario/usuario.service"
import type { Pedido } from "../../../../services/pedido/interfaces/pedido.interface"

@Component({
  selector: "app-visualizacion-pedidos",
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule, BadgeModule, ProgressSpinnerModule],
  templateUrl: "./visualizacion-pedidos.component.html",
  styleUrl: "./visualizacion-pedidos.component.scss",
})
export class VisualizacionPedidosComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService)
  private readonly usuarioService = inject(UsuarioService)

  protected pedidos: Pedido[] = []
  protected cargando = false
  protected usuarioLogueado = false
  protected usuarioId?: number

  ngOnInit(): void {
    console.log("[DEBUG] Inicializando componente de pedidos")
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        console.log("[DEBUG] Usuario obtenido:", usuario)
        this.usuarioId = usuario?.id
        this.usuarioLogueado = !!usuario?.id
        if (this.usuarioId) {
          console.log("[DEBUG] Cargando pedidos para usuario ID:", this.usuarioId)
          this.cargarPedidos()
        } else {
          console.log("[DEBUG] No hay usuario logueado")
        }
      },
      error: (error) => {
        console.error("[ERROR] Error al obtener usuario:", error)
        this.usuarioLogueado = false
      },
    })
  }

  private cargarPedidos(): void {
    if (!this.usuarioId) {
      console.log("[DEBUG] No se puede cargar pedidos: usuarioId es undefined")
      return
    }

    console.log("[DEBUG] Iniciando carga de pedidos...")
    this.cargando = true
    this.pedidoService.obtenerPedidosPorUsuario(this.usuarioId).subscribe({
      next: (pedidos) => {
        console.log("[DEBUG] Pedidos cargados exitosamente:", pedidos)
        this.pedidos = pedidos
        this.cargando = false
      },
      error: (error) => {
        console.error("[ERROR] Error al cargar pedidos:", error)
        this.cargando = false
      },
    })
  }

  protected getEstadoLabel(estado: string): string {
    const estados: { [key: string]: string } = {
      pendiente: "Pendiente",
      procesando: "Procesando",
      enviado: "Enviado",
      entregado: "Entregado",
      completado: "Completado",
      cancelado: "Cancelado",
    }
    return estados[estado] || estado
  }

  protected getEstadoSeverity(
    estado: string,
  ): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    const severities: { [key: string]: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" } = {
      pendiente: "warn",
      procesando: "info",
      enviado: "info",
      entregado: "success",
      completado: "success",
      cancelado: "danger",
    }
    return severities[estado] || "secondary"
  }
}
