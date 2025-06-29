import { Component, inject, type OnInit, signal } from "@angular/core"
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common"
import { TableModule } from "primeng/table"
import { TagModule } from "primeng/tag"
import { PanelModule } from "primeng/panel"
import { ButtonModule } from "primeng/button"
import { DropdownModule } from "primeng/dropdown"
import { FormsModule } from "@angular/forms"
import { MessageService } from "primeng/api"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import {PedidoService} from '../../../../services/pedido/pedido.service';
import {Pedido} from '../../../../services/pedido/interfaces/pedido.interface';

@Component({
  selector: "app-admin-pedidos",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CurrencyPipe,
    DatePipe,
    PanelModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: "./admin-pedidos.component.html",
  styleUrl: "./admin-pedidos.component.scss",
})
export class AdminPedidosComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService)
  private readonly toast = inject(MessageService)

  pedidos = signal<Pedido[]>([])
  isLoading = signal(true)
  error = signal<string | null>(null)

  estadosDisponibles = [
    { label: "Pendiente", value: "pendiente" },
    { label: "Completado", value: "completado" },
    { label: "Cancelado", value: "cancelado" },
  ]

  ngOnInit(): void {
    this.cargarPedidos()
  }

  cargarPedidos(): void {
    this.isLoading.set(true)
    this.error.set(null)
    this.pedidoService.obtenerTodosLosPedidos().subscribe({
      next: (data) => {
        this.pedidos.set(data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error("Error al obtener todos los pedidos:", err)
        this.error.set("No se pudieron cargar los pedidos. Intenta de nuevo más tarde.")
        this.isLoading.set(false)
      },
    })
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

  onEstadoChange(pedido: Pedido, newEstado: string): void {
    if (confirm(`¿Estás seguro de cambiar el estado del pedido #${pedido.id} a "${newEstado}"?`)) {
      this.pedidoService.actualizarEstadoPedido(pedido.id, newEstado).subscribe({
        next: () => {
          this.toast.add({
            severity: "success",
            summary: "Éxito",
            detail: `Estado del pedido #${pedido.id} actualizado a "${newEstado}"`,
          })
          this.cargarPedidos()
        },
        error: (err) => {
          console.error("Error al actualizar estado:", err)
          this.toast.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar el estado del pedido." })
        },
      })
    }
  }
}
