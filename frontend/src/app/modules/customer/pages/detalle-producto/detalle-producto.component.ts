import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductoService} from '../../../../services/producto/producto.service';
import {Producto} from '../../../../services/producto/interfaces/producto.interface';
import {CurrencyPipe, ViewportScroller} from '@angular/common';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-detalle-producto',
  imports: [
    CurrencyPipe,
    ButtonDirective
  ],
  templateUrl: './detalle-producto.component.html',
  standalone: true,
  styleUrl: './detalle-producto.component.scss'
})
export class DetalleProductoComponent implements OnInit{
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly productoService: ProductoService = inject(ProductoService);
  private readonly viewportScroller: ViewportScroller = inject(ViewportScroller)
  protected idProducto!: string | null ;
  protected producto!: Producto;

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.idProducto = this.activatedRoute.snapshot.paramMap.get('id');
    this.productoService.obtenerPorId(this.idProducto ?? "0").subscribe({
      next: (data: Producto) => {
        this.producto = data
      },
      error: (err: any) => {
        console.log(err)
      },
      complete: () => {}
    })
  }

}
