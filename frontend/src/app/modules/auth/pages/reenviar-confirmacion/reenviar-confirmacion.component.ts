<<<<<<< HEAD
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from "primeng/message";
import {Card} from "primeng/card";
import {Button} from "primeng/button";
import {UsuarioService} from '../../../../services/usuario.service';
=======
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { UsuarioService } from '../../../../services/usuario.service';
>>>>>>> 53cfc9e56ef3721878bb0f73ccdf13e171cacee9

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

  ngOnInit(): void {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  reenviarCorreo() {
    this.servicioUsuario.reenviarCorreo(this.userId).subscribe({
      next: (data: any) => {
        this.mensaje = data.mensaje;
        this.exito = true;
      },
      error: (e) => {
        if (e.status === 409) {
          this.router.navigate(['/cuenta/login']);
        }
        this.exito = false;
        this.mensajeError = e.error.error;
      },
      complete: () => {},
    });
  }
}
