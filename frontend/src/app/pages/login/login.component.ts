import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {UsuarioService} from '../../services/usuario.service';
import {MessageModule} from 'primeng/message';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CardModule, InputTextModule, ButtonModule, ReactiveFormsModule, MessageModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  protected enviando: boolean = false;
  protected exito: boolean = false;
  private servicioUsuario: UsuarioService = inject(UsuarioService)
  private router: Router = inject(Router);

  login() {
    this.enviando = true;
    const email = this.form.get('email')?.value;
    const contrasena = this.form.get('password')?.value;

    if (this.form.valid) {
      this.enviando = false
      this.servicioUsuario.iniciarSesion({email, contrasena}).subscribe({
        next: (data: any) => {
          if (data.exito) {
            this.exito = data.exito;
            setTimeout(()=>{
              this.router.navigate(['/']);
            }, 2500)
          }
        },
        error: (error) => console.log(error),
        complete: () => this.enviando = false
      })
    } else {
      this.form.markAllAsTouched();
    }
    this.enviando = false;

    // Lógica de autenticación acá
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email]],
      password: ['tester', [Validators.required, Validators.minLength(6)]],
    })
  }
}
