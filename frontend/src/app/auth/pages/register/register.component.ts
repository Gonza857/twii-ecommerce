import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {Router, RouterLink} from '@angular/router';
import {Message, MessageModule} from 'primeng/message';
import {UsuarioService} from '../../../services/usuario.service';

@Component({
  selector: 'app-register',
    imports: [
        FormsModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        ReactiveFormsModule,
        Message,
        MessageModule,
        RouterLink
    ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private servicioUsuario: UsuarioService = inject(UsuarioService)
  private router: Router = inject(Router)
  private fb: FormBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  protected enviando: boolean = false;
  protected mensajeError!: string;
  protected exito: boolean = false;

  register(): void {
    this.mensajeError = "";
    this.enviando = true;

    if (this.form.get('cContrasena')?.value !== this.form.get('contrasena')?.value) {
      this.enviando = false;
      this.form.get('cContrasena')?.setErrors({ mismatch: true });
      this.form.get('contrasena')?.setErrors({ mismatch: true });
      return
    }

    const campos: string[] = ["email", "contrasena", "cContrasena", "nombre", "apellido", "direccion"];
    let usuario: any = {}
    for (const campo of campos) {
      usuario[campo] = this.form.get(campo)?.value;
    }

    if (this.form.valid) {
      console.log("Form valido")
      this.enviando = false;
      this.servicioUsuario.registrarse(usuario).subscribe({
        next: (data: any) => {
          console.log("Exito pa")
          console.log(data)
          if (data.exito) {
            this.exito = data.exito
            setTimeout(()=>{
              this.router.navigate(['/login']);
            }, 2500)
          }
        },
        error: (e) => {
          console.log(e)
          this.mensajeError = e.error.mensaje
        },
        complete: () => this.enviando = false
      })
    } else {
      this.form.markAllAsTouched();
    }

    this.enviando = false;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['test@registrado.com', [Validators.required, Validators.email]],
      contrasena: ['tester', [Validators.required, Validators.minLength(6)]],
      cContrasena: ['tester', [Validators.required, Validators.minLength(6)]],
      nombre: ['Gonzalo', [Validators.required,]],
      apellido: ['Ramos', [Validators.required,]],
      direccion: ['Casa 123', [Validators.required,]],
    })
  }
}
