import { Component, OnInit } from '@angular/core';
import { EstrategiasService } from '../../services/estrategia.service';
import { Estrategia } from '../../models/estrategia';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-estrategias',
  templateUrl: './estrategias.component.html',
  styleUrls: ['./estrategias.component.css'],
  imports: [CommonModule, SafeUrlPipe, ReactiveFormsModule, RouterModule, HeaderComponent],
})

export class EstrategiasComponent implements OnInit {
  public estrategias: Estrategia[] = [];
  public isLoggedIn = false;
  public videoAmpliado: Estrategia | null = null;
  public userName: string | null = null;

  public agentes = [
    { nombre: 'phoenix', imagen: 'assets/agentes/phoenix.png' },
    { nombre: 'brimstone', imagen: 'assets/agentes/brimstone.png' },
    { nombre: 'breach', imagen: 'assets/agentes/breach.png' },
    { nombre: 'fade', imagen: 'assets/agentes/fade.png' },
    { nombre: 'gekko', imagen: 'assets/agentes/gekko.png' },
    { nombre: 'harbor', imagen: 'assets/agentes/harbor.png' },
    { nombre: 'kyo', imagen: 'assets/agentes/kyo.png' },
    { nombre: 'omen', imagen: 'assets/agentes/omen.png' },
    { nombre: 'raze', imagen: 'assets/agentes/raze.png' },
    { nombre: 'sova', imagen: 'assets/agentes/sova.png' },
    { nombre: 'viper', imagen: 'assets/agentes/viper.png' },
    { nombre: 'cypher', imagen: 'assets/agentes/cypher.png' },
  ];

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

  public agenteActivo: string = '';
  public mapaActivo: string = '';
  public filtroActivo: string | null = 'todas';
  public activePage: string = 'estrategias';
  public favoritosIds: number[] = [];
  private primerCheck = true;
  public userId: any;


  constructor(
    private estrategiasService: EstrategiasService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}

  mensajeFavorito: string | null = null;
  mostrarMensajeFavorito: boolean = false;
  favoritos: any[] = [];

  anadirAFavoritos(estrategiaId: number) {
  const userId = localStorage.getItem('userId');
  const token = this.authService.getToken();
  if (!token || !userId) return;

  this.http.post('http://localhost:8000/api/favoritos', {
    estrategia_id: estrategiaId
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (response) => {
      console.log('Favorito añadido:', response);
      this.favoritosIds.push(estrategiaId);
    },
    error: (error) => {
      console.error('Error al añadir favorito:', error);
    }
  });
}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (this.primerCheck) {
        this.primerCheck = false;
        if (!user) return;
      }
      if (user) {
        this.isLoggedIn = this.authService.isAuthenticated();
        this.userName = user.name;
        this.userId = user.id;
        this.loadEstrategias();
        this.loadFavoritos();
      } else {
        this.isLoggedIn = false;
        this.userName = null;
      }
    });
  }

  private normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // elimina tildes
  }

  loadEstrategias(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.estrategiasService.getEstrategias(token).subscribe({
      next: (data) => {
        this.estrategias = data.filter(e => e.video && e.video.toLowerCase().startsWith('videos/'));
      },
      error: (err) => {
        console.error(err);
        if (err.status === 401) this.router.navigate(['/login']);
      },
    });
  }


  get estrategiasFiltradas(): Estrategia[] {
    return this.estrategias.filter(e => {
      const tipoOk =
        this.filtroActivo === 'todas' ||
        this.normalize(e.tipo) === this.filtroActivo;

      let agentesArray: string[] = [];
      if (e.agentes && typeof e.agentes === 'string') {
        try {
          agentesArray = JSON.parse(e.agentes);
        } catch {
          // Si falla el parseo, lo dejamos vacío
        }
      }

      const agenteOk = !this.agenteActivo || (agentesArray && agentesArray.map(a => this.normalize(a)).includes(this.normalize(this.agenteActivo)));

      const mapaOk =
        !this.mapaActivo ||
        (e.mapa && this.normalize(e.mapa) === this.normalize(this.mapaActivo));

      return tipoOk && agenteOk && mapaOk;
    });
  }

  setFiltro(filtro: string) {
    if (this.filtroActivo === filtro) {
      this.filtroActivo = null; // lo desactiva si vuelves a pulsarlo
    } else {
      this.filtroActivo = filtro;
    }
  }

  goToCrearEstrategia(): void {
    this.router.navigate(['/crear-estrategia']);
  }

  abrirVideo(estrategia: Estrategia): void {
  if (!this.isLoggedIn) {
    this.mostrarAvisoLogin();
    return;
  }

  // Asegúrate de parsear correctamente los agentes
  const copiaEstrategia = { ...estrategia };
  if (typeof copiaEstrategia.agentes === 'string') {
    try {
      copiaEstrategia.agentes = JSON.parse(copiaEstrategia.agentes);
    } catch (e) {
      copiaEstrategia.agentes = [];
    }
  }
  this.videoAmpliado = copiaEstrategia;
  document.body.classList.add('modal-open');
}


  getAgenteImagen(nombreAgente: string): string {
  const normalizado = this.normalize(nombreAgente);
  const agente = this.agentes.find(a => this.normalize(a.nombre) === normalizado);
  return agente ? agente.imagen : 'assets/default-agente.png';
}

getMapaImagen(nombreMapa: string): string {
  const normalizado = this.normalize(nombreMapa);
  const mapa = this.mapas.find(m => this.normalize(m.nombre) === normalizado);
  return mapa ? mapa.imagen : 'assets/default-mapa.png';
}

  cerrarVideo(): void {
    this.videoAmpliado = null;
    document.getElementById('modal-overlay')?.classList.remove('active');
    document.getElementById('modal-video')?.classList.remove('active');
    // Eliminar la clase para permitir el desplazamiento de la página principal
    document.body.classList.remove('modal-open');
  }

  setActive(page: string): void {
    this.activePage = page;
  }

  setAgenteFiltro(agente: string): void {
    if (this.agenteActivo === agente) {
      // Si ya está activo, lo deselecciona (toggle)
      this.agenteActivo = '';
    } else {
      this.agenteActivo = agente;
    }
  }

  setMapaFiltro(mapa: string): void {
    if (this.mapaActivo === mapa) {
      this.mapaActivo = '';
    } else {
      this.mapaActivo = mapa;
    }
  }

  mapaEnPantallaCompleta: boolean = false;

  toggleMapaPantallaCompleta() {
    this.mapaEnPantallaCompleta = !this.mapaEnPantallaCompleta;
  }

  getAgentesDeVideoAmpliado(): string[] {
    if (this.videoAmpliado?.agentes) {
    if (Array.isArray(this.videoAmpliado.agentes)) {
      return this.videoAmpliado.agentes;
    }
    try {
      return JSON.parse(this.videoAmpliado.agentes);
    } catch (error) {
      console.error('Error parseando agentes:', error);
    }
  }
  return [];
}


  logout() {
    this.authService.logout();  // Cerrar sesión
    this.router.navigate(['/']);  // Redirigir a la página principal o la que desees
  }

  // Función para alternar el modo pantalla completa
  toggleFullscreen(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const iframe = target.closest('iframe');
    const img = target.closest('img');

    if (iframe) {
      iframe.classList.toggle('fullscreen');
    }

    if (img) {
      img.classList.toggle('fullscreen');
    }
  }

  esFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }

  loadFavoritos() {
    const token = this.authService.getToken();
    if (!token) return;

    this.http.get<any[]>('http://localhost:8000/api/favoritos', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.favoritos = data.map(fav => fav.estrategia_id); // solo IDs
      },
      error: (err) => {
        console.error('Error cargando favoritos:', err);
      }
    });
  }

  toggleFavorito(estrategiaId: number) {
  const token = this.authService.getToken();
  if (!token) return;

  if (this.favoritos.includes(estrategiaId)) {
    // Quitar favorito
    this.http.delete(`http://localhost:8000/api/favoritos/${this.userId}/${estrategiaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(id => id !== estrategiaId);
        this.mostrarMensaje('Eliminado de favoritos');
      },
      error: (err) => {
        console.error('Error al quitar favorito', err);
      }
    });
  } else {
    // Añadir favorito
    const favorito = { user_id: this.userId, estrategia_id: estrategiaId };
    this.http.post('http://localhost:8000/api/favoritos', favorito, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.favoritos.push(estrategiaId);
        this.mostrarMensaje('Añadido a favoritos');
      },
      error: (err) => {
        console.error('Error al añadir favorito', err);
      }
    });
  }
}

mostrarMensaje(texto: string) {
  this.mensajeFavorito = texto;
  this.mostrarMensajeFavorito = true;

  setTimeout(() => {
    this.mostrarMensajeFavorito = false;
    this.mensajeFavorito = null;
  }, 2500);  // mensaje visible 2.5 segundos
}

  eliminarDeFavoritos(estrategiaId: number) {
  const token = this.authService.getToken();
  if (!token) return;

  this.http.delete(`http://localhost:8000/api/favoritos/${estrategiaId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: () => {
      console.log('Favorito eliminado');
      this.favoritosIds = this.favoritosIds.filter(id => id !== estrategiaId);
    },
    error: (error) => {
      console.error('Error al eliminar favorito:', error);
    }
  });
}

mostrarAvisoLogin() {
  alert('Debes iniciar sesión para usar esta funcionalidad.');
}

}
