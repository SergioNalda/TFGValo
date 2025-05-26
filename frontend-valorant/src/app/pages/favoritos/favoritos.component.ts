import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from "../../shared/header/header.component";
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-favoritos',
  standalone: true,
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
  imports: [CommonModule, HeaderComponent]

})

export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];
  userId: number | null = null;
  estrategiaModal: any = null;
  public environment = environment;

  constructor(private authService: AuthService, private http: HttpClient,private sanitizer: DomSanitizer,) {}

  public mapas = [
    { nombre: 'Ascent', imagen: 'assets/mapas/ascent.jpg' },
    { nombre: 'Bind', imagen: 'assets/mapas/bind.jpg' },
    { nombre: 'Haven', imagen: 'assets/mapas/haven.png' },
    { nombre: 'Icebox', imagen: 'assets/mapas/icebox.png' },
    { nombre: 'Split', imagen: 'assets/mapas/split.png' },
    { nombre: 'Fracture', imagen: 'assets/mapas/fracture.png' },
    { nombre: 'Pearl', imagen: 'assets/mapas/pearl.png' },
    { nombre: 'Lotus', imagen: 'assets/mapas/lotus.png' },
    { nombre: 'Sunset', imagen: 'assets/mapas/sunset.png' },
  ];


  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.userId = user.id;
      this.cargarFavoritos();
    } else {
      console.warn('No user logged in');
    }
  }

  cargarFavoritos() {
    if (!this.userId) return;
    this.http.get<any[]>(`${environment.apiUrl}/favoritos/${this.userId}`).subscribe(data => {
      this.favoritos = data;
    });
  }

  abrirModal(estrategia: any) {
    this.estrategiaModal = estrategia;
  }

  cerrarModal() {
    this.estrategiaModal = null;
  }

  getMapaImagen(nombreMapa: string): string | null {
    const mapa = this.mapas.find(m => this.normalize(m.nombre) === this.normalize(nombreMapa));
    return mapa ? mapa.imagen : null;
  }


  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getVideoUrl(video: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(this.getStorageUrl(video));
}

  private normalize(str: string): string {
    return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // elimina tildes
  }

  getStorageUrl(path: string): string {
  const baseUrl = environment.apiUrl.replace('/api', '');
  return `${baseUrl}/storage/${path}`;
}

}
