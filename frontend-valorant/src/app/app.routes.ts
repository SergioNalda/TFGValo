import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EstrategiasComponent } from './pages/estrategias/estrategias.component';
import { CrearEstrategiaComponent } from './pages/estrategias/crear-estrategia.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { AuthGuard } from './services/auth.guard';
import { MirasComponent } from './pages/miras/miras.component';
import { AdminGuard } from './services/admin.guard';
import { AdminPanelComponent } from './pages/admin/admin-panel/admin-panel.component';
import { AdminEstrategiasComponent } from './pages/admin/admin-estrategias/admin-estrategias.component';
import { AdminMirasComponent } from './pages/admin/admin-miras/admin-miras.component';
import { AdminUsuariosComponent } from './pages/admin/admin-usuarios/admin-usuarios.component';
import { AdminRankingComponent } from './pages/admin/admin-ranking/admin-ranking.component';
import { NgModule } from '@angular/core';
import { CrearMiraComponent } from './pages/crear-mira-component/crear-mira..component';
import { PublicProfileComponent } from './pages/public-profile/public-profile.component';


export const routes: Routes = [
  { path: '', redirectTo: '/estrategias', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'miras', component: MirasComponent, canActivate: [AuthGuard] },
  { path: 'estrategias', component: EstrategiasComponent },
  { path: 'crear-estrategia', component: CrearEstrategiaComponent, canActivate: [AuthGuard] },
  { path: 'ranking',loadComponent: () => import('./pages/ranking/ranking.component').then(m => m.RankingComponent) },
  { path: 'favoritos',loadComponent: () => import('./pages/favoritos/favoritos.component').then(m => m.FavoritosComponent)},
  { path: 'editar-perfil',loadComponent: () => import('./pages/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),canActivate: [AuthGuard] },
  { path: 'crear-mira', component: CrearMiraComponent, canActivate: [AuthGuard] },
  { path: 'public-profile/:id',component: PublicProfileComponent},
  
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'admin/estrategias', component: AdminEstrategiasComponent },
      { path: 'estrategias', component: AdminEstrategiasComponent },
      { path: 'miras', component: AdminMirasComponent },
      { path: 'usuarios', component: AdminUsuariosComponent },
      { path: 'ranking', component: AdminRankingComponent },
      { path: '', redirectTo: 'estrategias', pathMatch: 'full' },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
