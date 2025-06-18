import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {NgClass} from '@angular/common';
import {Card} from 'primeng/card';
import {Message} from "primeng/message";
import {UsuarioService} from '../../../../services/usuario.service';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    NgClass,
    Card,
    Message
  ],
  templateUrl: './recuperar-contrasena.component.html',
  standalone: true,
  styleUrl: './recuperar-contrasena.component.scss'
})
export class RecuperarContrasenaComponent implements OnInit {
  protected form!: FormGroup;
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService)
  private readonly router: Router = inject(Router)
  protected enviando: boolean = false;
  protected exito: boolean = false;
  protected mensaje: string = "";

  protected enviar = () => {
    this.enviando = true;
    const email: string = this.form.get("email")?.value;
    if (this.form.valid) {
      this.servicioUsuario.recuperar(email).subscribe({
        next: (data: any) => {
          this.exito = true
        },
        error: (e) => {
          this.exito = false;
        },
        complete: () => {
        }
      })
    }
    this.enviando = false;
    this.mensaje = "Si tu cuenta existe, te hemos enviado un correo de confirmación."
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email]],
    })
  }
}
