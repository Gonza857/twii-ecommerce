import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { BadgeModule } from "primeng/badge"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { PedidoService } from "../../../../services/pedido/pedido.service"
import type { Pedido } from "../../../../services/pedido/interfaces/pedido.interface"
import type Decimal from "decimal.js"

@Component({
  selector: "app-detalle-pedido",
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule, BadgeModule, ProgressSpinnerModule],
  templateUrl: "./detalle-pedido.component.html",
  styleUrl: "./detalle-pedido.component.scss",
})
export class DetallePedidoComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService)
  private readonly activatedRoute = inject(ActivatedRoute)

  protected pedido: Pedido | null = null
  protected cargando = false

  ngOnInit(): void {
    const pedidoId = this.activatedRoute.snapshot.paramMap.get("id")
    if (pedidoId) {
      this.cargarPedido(Number(pedidoId))
    }
  }

  private cargarPedido(id: number): void {
    this.cargando = true
    this.pedidoService.obtenerPedidoPorId(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido
        this.cargando = false
      },
      error: (error) => {
        console.error("Error al cargar pedido:", error)
        this.pedido = null
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

  protected getSubtotal(precioUnitario: Decimal, cantidad: number): number {
    return precioUnitario.times(cantidad).toNumber()
  }
}
