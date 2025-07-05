import { Component, effect, inject, type OnInit } from "@angular/core"
import { CarritoItemComponent } from "../carrito-item/carrito-item.component"
import { RouterModule } from "@angular/router"
import { CommonModule } from "@angular/common"
import { ButtonModule } from "primeng/button"
import { UsuarioService } from "../../../../../services/usuario/usuario.service"
import {CarritoService} from '../../../../../services/carrito/carrito.service';

@Component({
  selector: "app-carrito-drawer",
  imports: [CommonModule, CarritoItemComponent, RouterModule, ButtonModule],
  templateUrl: "./carrito-drawer.component.html",
  standalone: true,
  styleUrl: "./carrito-drawer.component.scss",
})
export class CarritoDrawerComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService)
  public readonly carritoService = inject(CarritoService)

  protected total$ = this.carritoService.total
  protected carrito$ = this.carritoService.carrito

  public usuarioId?: number
  public usuarioLogueado = false

  constructor() {
    effect(() => {
    const usuario = this.usuarioService.usuario();
    this.usuarioLogueado = usuario != null;

      if (usuario?.id) {
        this.usuarioId = usuario.id;
        this.carritoService.obtenerCarrito(usuario.id);
      }
    })
  }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe()
  }

  vaciarCarrito(): void {
    if (this.usuarioId && confirm("¿Seguro que querés vaciar el carrito?")) {
      this.carritoService.vaciar(this.usuarioId)
    }
  }

  finalizarCompra(): void {
    if (this.usuarioId) {
      this.carritoService.finalizarCompra(this.usuarioId)
    }
  }
}
