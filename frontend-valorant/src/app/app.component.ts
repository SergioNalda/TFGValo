// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstrategiasComponent } from './pages/estrategias/estrategias.component';
import { CrearEstrategiaComponent } from './pages/estrategias/crear-estrategia.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { AuthGuard } from './services/auth.guard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],  // Asegúrate de que RouterModule esté en las importaciones
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  userName: string | null = null; // Propiedad que contiene el nombre del usuario

  // Métodos para manejar el inicio de sesión, registro y cierre de sesión
  login() {
    // Lógica para iniciar sesión (puedes redirigir o cambiar el estado de la variable userName)
    this.userName = 'UsuarioEjemplo';  // Ejemplo de usuario
  }

  register() {
    // Lógica para redirigir a la página de registro o abrir un modal de registro
    console.log('Registro en proceso...');
  }

  logout() {
    // Lógica para cerrar sesión (puedes eliminar el nombre del usuario)
    this.userName = null;  // Eliminar el nombre del usuario al cerrar sesión
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/estrategias', pathMatch: 'full' }, // Redirige a la página de estrategias por defecto
  { path: 'estrategias', component: EstrategiasComponent },     // Página de estrategias
  { path: 'estrategias/crear', component: CrearEstrategiaComponent, canActivate: [AuthGuard] }, // Página para crear estrategia (protege con guard)
  { path: 'ranking', component: RankingComponent },  // Página de ranking
];

RouterModule.forRoot(routes);  // Configuración de rutas
