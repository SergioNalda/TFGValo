import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterModule,NgIf],
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage: string | null = null;
  private errorTimeout: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  showError(message: string) {
    this.errorMessage = message;

    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    this.errorTimeout = setTimeout(() => {
      this.errorMessage = null;
    }, 6000); // desaparece después de 6 segundos
  }

  onLogin() {
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response: any) => {
        // Guardar datos y redirigir
        const roleId = response.user.role_id;
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('user_role', roleId.toString());

        if (roleId === 1) {
          this.router.navigate(['/admin-panel']);
        } else {
          this.router.navigate(['/estrategias']);
        }
      },
      error: (err) => {
        if (err.status === 403 && err.error?.message === 'Tu cuenta está desactivada. Contacta con un administrador.') {
          this.showError('Tu cuenta está desactivada. Contacta con un administrador para activarla.');
        } else if (err.status === 401) {
          this.showError('Credenciales incorrectas, por favor verifica tus datos.');
        } else if (err.status === 422) {
          this.showError('Por favor completa todos los campos correctamente.');
        } else {
          this.showError('Error desconocido al iniciar sesión. Inténtalo más tarde.');
        }
      }
    });
  }

  closeError() {
    this.errorMessage = null;
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}
