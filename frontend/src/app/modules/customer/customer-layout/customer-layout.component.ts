import {Component, effect, inject, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CarritoDrawerComponent } from '../pages/visualizacion-carrito/carrito-drawer/carrito-drawer.component';
import { CarritoService } from '../../../services/carrito.service';
import {UsuarioService} from '../../../services/usuario/usuario.service';
import {Usuario} from '../../../services/usuario/interfaces/usuario.interface';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet, DrawerModule, CarritoDrawerComponent],
  templateUrl: './customer-layout.component.html',
  standalone: true,
  styleUrl: './customer-layout.component.scss',
})
export class CustomerLayoutComponent implements OnInit{
  private readonly usuarioService: UsuarioService = inject(UsuarioService)
  protected usuarioActual: Usuario | null = null;
  carritoVisible = false;
  public readonly carritoService = inject(CarritoService);

  constructor() {
    effect(() => {
      this.carritoVisible = this.carritoService.drawerVisible();
    });
  }

  toggleCarrito(): void {
    this.carritoService.drawerVisible.set(!this.carritoVisible);
  }

  cerrarSesion () {
    this.usuarioService.cerrarSesion()
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.usuario();

  }
}
