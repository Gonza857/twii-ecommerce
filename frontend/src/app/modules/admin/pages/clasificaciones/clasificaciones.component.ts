import { Component, inject, OnInit, signal } from '@angular/core';
import { Clasificacion, ClasificacionService } from '../../../../services/clasificacion/clasificacion.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-clasificaciones',
  imports: [TableModule, DialogModule, InputTextModule, FormsModule, ConfirmDialogModule],
  templateUrl: './clasificaciones.component.html',
  styleUrl: './clasificaciones.component.scss',
  providers: [ConfirmationService]
})
export class ClasificacionesComponent {

  protected readonly clasificacionService: ClasificacionService = inject(ClasificacionService);
  protected readonly confirmationService: ConfirmationService = inject (ConfirmationService);
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
    this.confirmationService.confirm({
    message: '¿Está seguro que desea eliminar esta clasificación?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.clasificacionService.eliminarClasificacion(id).subscribe(() => {
        this.obtenerClasificaciones();
      });
    }
  });
  }

  manejarFormularioCerrado(recargar: boolean): void {
    this.displayDialog.set(false);
    if (recargar) {
      this.obtenerClasificaciones();
    }
  }
}


