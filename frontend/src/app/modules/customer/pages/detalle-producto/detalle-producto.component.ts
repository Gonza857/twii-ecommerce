import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {ProductoService} from '../../../../services/producto/producto.service';
import {CurrencyPipe, ViewportScroller} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import { ProgressSpinnerModule} from 'primeng/progressspinner';
import {StyleClass} from 'primeng/styleclass';
import {CarritoService} from '../../../../services/carrito.service';
import {UsuarioService} from '../../../../services/usuario/usuario.service';


@Component({
  selector: 'app-detalle-producto',
  imports: [
    CurrencyPipe,
    ButtonDirective,
    RouterModule,
    ProgressSpinnerModule,
    StyleClass
  ],
  templateUrl: './detalle-producto.component.html',
  standalone: true,
  styleUrl: './detalle-producto.component.scss'
})
export class DetalleProductoComponent implements OnInit, OnDestroy{
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected readonly productoService: ProductoService = inject(ProductoService);
  protected readonly carritoService: CarritoService = inject(CarritoService);
  protected readonly usuarioService: UsuarioService = inject(UsuarioService);
  private readonly viewportScroller: ViewportScroller = inject(ViewportScroller)
  protected idProducto!: string | null ;

  protected producto = this.productoService.producto; // Signal del producto
  protected isLoading = this.productoService.isLoading; // Signal del estado de carga
  protected error = this.productoService.error; // Signal del mensaje de error

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.idProducto = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idProducto) {
      this.productoService.obtenerPorId(this.idProducto ?? "0")
    }
  }

  ngOnDestroy(): void {
    this.productoService.limpiarProducto();
  }

  agregarAlCarrito() {
    const idUsuario = this.usuarioService.usuario()?.id
    if (this.usuarioService.usuario() == null && !idUsuario) return;
    this.carritoService.agregarProducto(idUsuario!, this.producto()!.id, 1);
    this.carritoService.abrirDrawer();
  }
}
