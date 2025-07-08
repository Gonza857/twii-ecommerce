import { Component, inject, OnInit, signal } from '@angular/core';
import { Clasificacion, ClasificacionService } from '../../../../services/clasificacion/clasificacion.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clasificaciones',
  imports: [TableModule, DialogModule, InputTextModule, FormsModule],
  templateUrl: './clasificaciones.component.html',
  styleUrl: './clasificaciones.component.scss'
})
export class ClasificacionesComponent {

  protected readonly clasificacionService: ClasificacionService = inject(ClasificacionService);
  clasificaciones: Clasificacion[] = [];
  displayDialog = signal(false);
  esModoEdicion = signal(false);
  clasificacionActual = signal<Clasificacion | null>(null);
  nombre: string = '';


ngOnInit() {
    this.obtenerClasificaciones();
  }

  obtenerClasificaciones(): void {
    this.clasificacionService.obtenerClasificaciones().subscribe(data => {
      this.clasificaciones = data;
    });
  }

abrirAgregar(): void {
  this.esModoEdicion.set(false);
  this.nombre = '';
  this.clasificacionActual.set(null);
  this.displayDialog.set(true);
}

abrirEditar(clasificacion: Clasificacion): void {
  this.esModoEdicion.set(true);
  this.nombre = clasificacion.nombre;
  this.clasificacionActual.set(clasificacion);
  this.displayDialog.set(true);
}

guardarClasificacion(): void {
  const data = { nombre: this.nombre };

  if (this.esModoEdicion() && this.clasificacionActual()) {
    this.clasificacionService
      .actualizarClasificacion(this.clasificacionActual()!.id, data)
      .subscribe(() => {
        this.obtenerClasificaciones();
        this.displayDialog.set(false);
      });
  } else {
    this.clasificacionService.crearClasificacion(data).subscribe(() => {
      this.obtenerClasificaciones();
      this.displayDialog.set(false);
    });
  }
}

  eliminarClasificacion(id: number): void {
    if (confirm('¿Eliminar esta clasificación?')) {
      this.clasificacionService.eliminarClasificacion(id).subscribe(() => {
        this.obtenerClasificaciones();
      });
    }
  }

  manejarFormularioCerrado(recargar: boolean): void {
    this.displayDialog.set(false);
    if (recargar) {
      this.obtenerClasificaciones();
    }
  }
}


