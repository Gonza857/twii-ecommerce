import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { UsuarioService } from '../../../../services/usuario/usuario.service';


@Component({
  selector: 'app-usuarios',
  imports: [TableModule, BadgeModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService);
  protected usuarios!: any[];

  ngOnInit(): void {
    this.servicioUsuario.obtenerUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
