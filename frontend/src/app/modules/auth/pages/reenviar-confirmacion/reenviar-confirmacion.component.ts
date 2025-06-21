import {Component, effect, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import {UsuarioService} from '../../../../services/usuario/usuario.service';

@Component({
  selector: 'app-confirmar-cuenta',
  imports: [Message, Card, Button],
  templateUrl: './reenviar-confirmacion.component.html',
  standalone: true,
  styleUrl: './reenviar-confirmacion.component.scss',
})
export class ReenviarConfirmacionComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService);
  private readonly router: Router = inject(Router);
  protected userId!: number;
  protected exito: boolean = false;
  protected mensaje!: string;
  protected mensajeError!: string;

  constructor() {
    effect(() => {
      const resultado = this.servicioUsuario.respuestaServidor();
      if (!resultado) return;

      this.exito = resultado.exito ?? false;
      if (resultado.exito) {
        this.mensaje = resultado.mensaje ?? "";
      } else {
        if (resultado.redireccion) {
          this.router.navigate(['/cuenta/login']);
        } else {
          this.mensajeError = resultado.mensaje ?? "";
        }
      }
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  reenviarCorreo() {
    this.servicioUsuario.reenviarCorreo(this.userId)
  }
}
