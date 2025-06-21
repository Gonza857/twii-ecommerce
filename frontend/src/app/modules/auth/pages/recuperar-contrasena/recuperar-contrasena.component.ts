import {Component, effect, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { NgClass } from '@angular/common';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import {UsuarioService} from '../../../../services/usuario/usuario.service';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    NgClass,
    Card,
    Message,
  ],
  templateUrl: './recuperar-contrasena.component.html',
  standalone: true,
  styleUrl: './recuperar-contrasena.component.scss',
})
export class RecuperarContrasenaComponent implements OnInit {
  protected form!: FormGroup;
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService);
  protected enviando: boolean = false;
  protected exito: boolean = false;
  protected mensaje: string = '';

  constructor() {
    effect(() => {
      const resultado = this.servicioUsuario.respuestaServidor();
      if (!resultado) return;

      if (resultado.exito) {
        this.mensaje = resultado.mensaje ?? "Si tu cuenta existe, te hemos enviado un correo de confirmación."
      }

    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email]],
    });
  }

  protected enviar = () => {
    this.enviando = true;
    const email: string = this.form.get('email')?.value;

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.enviando = false;
      return;
    }

    this.servicioUsuario.recuperar(email);
  };


}
