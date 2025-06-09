import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-lista-productos',
  imports: [CommonModule],
  templateUrl: './visualizacion-productos.component.html',
  styleUrls: ['./visualizacion-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = []

  constructor(private productoServicio: ProductoService){

  }

  ngOnInit(): void {
    this.productoServicio.obtenerProductos().subscribe(data => {
      this.productos = data;
    });
  }

}
