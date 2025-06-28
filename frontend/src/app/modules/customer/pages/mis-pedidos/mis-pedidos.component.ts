import { Component, inject, type OnInit, signal } from "@angular/core"
import { PedidoService } from "../../../../services/pedido.service"
import { UsuarioService } from "../../../../services/usuario/usuario.service"
import type { Pedido } from "./interfaces/pedido.interface"
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common"
import { TableModule } from "primeng/table"
import { TagModule } from "primeng/tag"
import { PanelModule } from "primeng/panel"
import { ButtonModule } from "primeng/button"
import { ProgressSpinnerModule } from "primeng/progressspinner"

@Component({
  selector: "app-mis-pedidos",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CurrencyPipe,
    DatePipe,
    PanelModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: "./mis-pedidos.component.html",
  styleUrl: "./mis-pedidos.component.scss",
})
export class MisPedidosComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService)
  private readonly usuarioService = inject(UsuarioService)

  pedidos = signal<Pedido[]>([])
  isLoading = signal(true)
  error = signal<string | null>(null)

  ngOnInit(): void {
    const userId = this.usuarioService.usuario()?.id
    if (userId) {
      this.pedidoService.obtenerPedidosPorUsuario(userId).subscribe({
        next: (data) => {
          this.pedidos.set(data)
          this.isLoading.set(false)
        },
        error: (err) => {
          console.error("Error al obtener pedidos:", err)
          this.error.set("No se pudieron cargar tus pedidos. Intenta de nuevo más tarde.")
          this.isLoading.set(false)
        },
      })
    } else {
      this.error.set("Debes iniciar sesión para ver tus pedidos.")
      this.isLoading.set(false)
    }
  }

  getSeverity(status: string): string {
    switch (status.toLowerCase()) {
      case "completado":
        return "success"
      case "pendiente":
        return "warning"
      case "cancelado":
        return "danger"
      default:
        return "info"
    }
  }
}
