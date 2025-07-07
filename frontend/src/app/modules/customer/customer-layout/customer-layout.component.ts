import { FiltroService } from './../../../services/producto/filtro.service';
import { Component, effect, inject, type OnInit } from "@angular/core"
import { RouterLink, RouterOutlet } from "@angular/router"
import { DrawerModule } from "primeng/drawer"
import { CarritoDrawerComponent } from "../pages/visualizacion-carrito/carrito-drawer/carrito-drawer.component"
import { UsuarioService } from "../../../services/usuario/usuario.service"
import type { Usuario } from "../../../services/usuario/interfaces/usuario.interface"
import {CarritoService} from '../../../services/carrito/carrito.service';
import { ProductoService } from "../../../services/producto/producto.service"

@Component({
  selector: "app-home",
  imports: [RouterLink, RouterOutlet, DrawerModule, CarritoDrawerComponent],
  templateUrl: "./customer-layout.component.html",
  standalone: true,
  styleUrl: "./customer-layout.component.scss",
})
export class CustomerLayoutComponent implements OnInit {
  protected readonly usuarioService: UsuarioService = inject(UsuarioService)
  protected usuarioActual: Usuario | null = null
  carritoVisible: boolean = false
  public readonly carritoService = inject(CarritoService)
  protected readonly productoService: ProductoService = inject(ProductoService)
  protected readonly filtroService: FiltroService = inject(FiltroService)

  constructor() {
    effect(() => {
      this.carritoVisible = this.carritoService.drawerVisible()
      this.usuarioActual = this.usuarioService.usuario()
    })
  }

  toggleCarrito(): void {
    this.carritoService.drawerVisible.set(!this.carritoVisible)
  }

  cerrarSesion() {                
    localStorage.removeItem('filtrosProductos');

    this.filtroService.filtrosRemovidos$.next();

    this.usuarioService.cerrarSesion()
  }

  ngOnInit(): void {
    console.log("Layout montado")
    this.usuarioService.obtenerUsuarioActual().subscribe()
  }

  get esAdmin(): boolean {
    return this.usuarioActual?.rol?.id === 1;
  }
}
