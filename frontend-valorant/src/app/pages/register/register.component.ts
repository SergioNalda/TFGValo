import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  password_confirmation = '';

  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    this.message = '';
    this.messageType = '';

    if (!this.username || !this.email || !this.password || !this.password_confirmation) {
      this.message = 'Por favor, rellena todos los campos obligatorios.';
      this.messageType = 'error';
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.message = 'Las contraseñas no coinciden.';
      this.messageType = 'error';
      return;
    }

    this.authService.register({
      name: this.username,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      role_id: 2
    }).subscribe({
      next: () => {
        this.message = 'Cuenta creada con éxito. Redirigiendo...';
        this.messageType = 'success';
        setTimeout(() => window.location.href = '/login', 1500);
      },
      error: (err) => {
        this.message = 'Hubo un error al crear la cuenta. Inténtalo de nuevo.';
        this.messageType = 'error';
        console.error('Error de registro:', err);
      }
    });
  }
}
