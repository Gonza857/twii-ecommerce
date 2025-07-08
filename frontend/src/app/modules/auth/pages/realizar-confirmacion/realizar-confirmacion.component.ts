import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UsuarioService} from '../../../../services/usuario/usuario.service';

@Component({
  selector: 'app-realizar-confirmacion',
  imports: [],
  templateUrl: './realizar-confirmacion.component.html',
  standalone: true,
  styleUrl: './realizar-confirmacion.component.scss',
})
export class RealizarConfirmacionComponent implements OnInit, OnDestroy {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly usuarioService: UsuarioService = inject(UsuarioService);
  private readonly router: Router = inject(Router);
  private token!: string | null;

  constructor() {
    effect(() => {
      const resultado = this.usuarioService.respuestaServidor();
      if (!resultado) return;

      if (resultado.exito) {
        this.router.navigate(["/cuenta/confirmada"])
      }

    });
  }


  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    if (this.token == null) return;
    this.usuarioService.confirmarCuenta(this.token)
  }

  ngOnDestroy(): void {
    this.usuarioService.limpiarRespuesta()
  }
}
