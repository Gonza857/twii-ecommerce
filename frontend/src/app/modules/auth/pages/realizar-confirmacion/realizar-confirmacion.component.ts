<<<<<<< HEAD
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioService} from '../../../../services/usuario.service';

=======
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';
>>>>>>> 53cfc9e56ef3721878bb0f73ccdf13e171cacee9

@Component({
  selector: 'app-realizar-confirmacion',
  imports: [],
  templateUrl: './realizar-confirmacion.component.html',
  standalone: true,
  styleUrl: './realizar-confirmacion.component.scss',
})
export class RealizarConfirmacionComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly usuarioService: UsuarioService = inject(UsuarioService);
  private readonly router: Router = inject(Router);
  private token!: string | null;

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    if (this.token == null) return;
    this.usuarioService.confirmarCuenta(this.token).subscribe({
<<<<<<< HEAD
      next: () => {
        this.router.navigate(["/cuenta/confirmada"])
=======
      next: (data) => {
        this.router.navigate(['/cuenta/confirmada']);
>>>>>>> 53cfc9e56ef3721878bb0f73ccdf13e171cacee9
      },
      error: (e) => {
        if (e.status === 400 || e.status === 401) {
        }
      },
      complete: () => {},
    });
  }
}
