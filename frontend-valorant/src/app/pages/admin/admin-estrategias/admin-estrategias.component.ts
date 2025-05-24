import { Component, OnInit } from '@angular/core';
import { AdminEstrategiasService, Estrategia } from './admin-estrategias.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Agente {
  nombre: string;
  imagen: string;
}

interface Mapa {
  nombre: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-estrategias',
  templateUrl: './admin-estrategias.component.html',
  styleUrls: ['./admin-estrategias.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminEstrategiasComponent implements OnInit {
  estrategias: Estrategia[] = [];
  cargando = false;
  error = '';

  estrategiaForm: FormGroup;

  estrategiaEditando: Estrategia | null = null;

  agentes: Agente[] = [
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

  mapas: Mapa[] = [
    { nombre: 'Ascent' },
    { nombre: 'Bind' },
    { nombre: 'Haven' },
    { nombre: 'Icebox' },
    { nombre: 'Split' },
    { nombre: 'Fracture' },
    { nombre: 'Pearl' },
    { nombre: 'Lotus' },
    { nombre: 'Sunset' },
  ];

  selectedFile: File | null = null;
  videoPreviewUrl: string | null = null;
  errorMessage = '';

  constructor(private estrategiaService: AdminEstrategiasService, private fb: FormBuilder) {
    this.estrategiaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      agentes: [[], Validators.required],  // array de nombres agentes
      mapa: ['', Validators.required],
      video: ['']  // URL del video actual o vacío
    });
  }

  ngOnInit() {
    this.cargarEstrategias();
  }

  cargarEstrategias() {
    this.cargando = true;
    this.estrategiaService.getEstrategias().subscribe({
      next: (data) => {
        this.estrategias = data.map(est => {
          if (typeof est.agentes === 'string') {
            try {
              est.agentes = JSON.parse(est.agentes);
            } catch {
              est.agentes = [];
            }
          }
          return est;
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar estrategias';
        this.cargando = false;
      }
    });
  }

  aprobar(id: number) {
  this.estrategiaService.aprobarEstrategia(id).subscribe({
    next: () => {
      const est = this.estrategias.find(e => e.id === id);
      if (est) est.is_approved = true;
      this.mostrarMensajeExito('Estrategia aprobada');
    },
    error: () => {
      this.mostrarMensajeError('Error al aprobar la estrategia');
    }
  });
}

mostrarConfirmacionEliminar = false;
idEliminar: number | null = null;

mensajeExito = '';
mensajeError = ''

confirmarEliminar(id: number) {
  this.idEliminar = id;
  this.mostrarConfirmacionEliminar = true;
}

// Cerrar modal de confirmación
cerrarConfirmacion() {
  this.mostrarConfirmacionEliminar = false;
  this.idEliminar = null;
}

  eliminar() {
  if (this.idEliminar === null) return;

  this.estrategiaService.eliminarEstrategia(this.idEliminar).subscribe({
    next: () => {
      this.mensajeExito = 'Estrategia eliminada correctamente.';
      this.mostrarConfirmacionEliminar = false;
      this.idEliminar = null;
      this.cargarEstrategias();
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => this.mensajeExito = '', 3000);
    },
    error: (err) => {
      this.mensajeError = 'Error al eliminar la estrategia.';
      this.mostrarConfirmacionEliminar = false;
      this.idEliminar = null;
      setTimeout(() => this.mensajeError = '', 3000);
    }
  });
}

  toggleAgente(nombre: string) {
    const agentesControl = this.estrategiaForm.get('agentes');
    if (!agentesControl) return;

    let currentAgentes: string[] = agentesControl.value || [];
    if (currentAgentes.includes(nombre)) {
      currentAgentes = currentAgentes.filter(a => a !== nombre);
    } else {
      currentAgentes.push(nombre);
    }
    agentesControl.setValue(currentAgentes);
    agentesControl.markAsTouched();
  }

  isAgenteSelected(nombre: string): boolean {
    const seleccionados: string[] = this.estrategiaForm.get('agentes')?.value || [];
    return seleccionados.includes(nombre);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.videoPreviewUrl = null;
      return;
    }

    const file = input.files[0];
    // Validar tipo y tamaño
    if (file.type !== 'video/mp4') {
      this.errorMessage = 'Solo se permiten archivos MP4';
      this.selectedFile = null;
      this.videoPreviewUrl = null;
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5 MB
      this.errorMessage = 'El archivo no puede superar 5 MB';
      this.selectedFile = null;
      this.videoPreviewUrl = null;
      return;
    }

    this.errorMessage = '';
    this.selectedFile = file;

    // Crear URL para vista previa
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl); // Liberar si ya existía uno previo
    }
    this.videoPreviewUrl = URL.createObjectURL(file);
  }

  parseAgentes(agentes: string[] | string): string[] {
    if (typeof agentes === 'string') {
      try {
        return JSON.parse(agentes);
      } catch {
        return [];
      }
    }
    return agentes;
  }

  getAgenteImagen(nombre: string): string {
    const agente = this.agentes.find(a => a.nombre === nombre);
    return agente ? agente.imagen : 'assets/agentes/default.png'; // Ruta de fallback
  }

  editar(est: Estrategia) {
    this.estrategiaEditando = est;

    this.estrategiaForm.patchValue({
      titulo: est.titulo,
      descripcion: est.descripcion,
      tipo: est.tipo,
      mapa: est.mapa,
      agentes: Array.isArray(est.agentes) ? est.agentes : this.parseAgentes(est.agentes),
      video: est.video || ''
    });

    this.selectedFile = null;
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
    this.errorMessage = '';
  }

  cancelarEdicion() {
    this.estrategiaEditando = null;
    this.estrategiaForm.reset();
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
    this.selectedFile = null;
    this.errorMessage = '';
  }

  guardarCambios() {
  if (!this.estrategiaEditando) return;

  if (this.estrategiaForm.invalid) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  const formData = new FormData();
  formData.append('titulo', this.estrategiaForm.value.titulo);
  formData.append('descripcion', this.estrategiaForm.value.descripcion);
  formData.append('tipo', this.estrategiaForm.value.tipo);
  formData.append('mapa', this.estrategiaForm.value.mapa);

  this.estrategiaForm.value.agentes.forEach((agente: string, i: number) => {
    formData.append(`agentes[${i}]`, agente);
  });

  if (this.selectedFile) {
    formData.append('video', this.selectedFile);
  }

  formData.append('_method', 'PUT');

  this.estrategiaService.actualizarEstrategia(this.estrategiaEditando.id, formData).subscribe({
    next: () => {
      this.mostrarMensajeExito('Estrategia actualizada');

      this.cancelarEdicion();
      this.cargarEstrategias();
    },
    error: (err) => {
      console.error('Error al actualizar estrategia', err);
      this.mostrarMensajeError('Error al actualizar estrategia: ' + (err.error?.message || 'Error desconocido'));
    }
  });
}
  getVideoUrl(path: string): string { 
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
  }

  mostrarMensajeExito(mensaje: string) {
  this.mensajeExito = mensaje;
  setTimeout(() => this.mensajeExito = '', 4000); // se borra en 4s
}

mostrarMensajeError(mensaje: string) {
  this.mensajeError = mensaje;
  setTimeout(() => this.mensajeError = '', 5000); // se borra en 5s
}

  
}
