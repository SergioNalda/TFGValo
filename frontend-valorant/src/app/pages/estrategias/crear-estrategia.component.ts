import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EstrategiasService } from '../../services/estrategia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crear-estrategia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-estrategia.component.html',
  styleUrls: ['./crear-estrategia.component.css'],
})

export class CrearEstrategiaComponent {
  form: FormGroup;
  errorMessage: string = '';
  selectedFile: File | null = null;
  videoFile: File | null = null;
  successMessage: string = '';
  
  public agentes = [
    { nombre: 'Phoenix', imagen: 'assets/agentes/phoenix.png' },
    { nombre: 'Brimstone', imagen: 'assets/agentes/brimstone.png' },
    { nombre: 'Breach', imagen: 'assets/agentes/breach.png' },
    { nombre: 'Fade', imagen: 'assets/agentes/fade.png' },
    { nombre: 'Gekko', imagen: 'assets/agentes/gekko.png' },
    { nombre: 'Harbor', imagen: 'assets/agentes/harbor.png' },
    { nombre: 'Kyo', imagen: 'assets/agentes/kyo.png' },
    { nombre: 'Omen', imagen: 'assets/agentes/omen.png' },
    { nombre: 'Raze', imagen: 'assets/agentes/raze.png' },
    { nombre: 'Sova', imagen: 'assets/agentes/sova.png' },
    { nombre: 'Viper', imagen: 'assets/agentes/viper.png' },
    { nombre: 'Cypher', imagen: 'assets/agentes/cypher.png' },
  ];

  public mapas = [
    { nombre: 'Ascent', imagen: 'assets/mapas/ascent.png' },
    { nombre: 'Bind', imagen: 'assets/mapas/bind.png' },
    { nombre: 'Haven', imagen: 'assets/mapas/haven.png' },
    { nombre: 'Split', imagen: 'assets/mapas/split.png' },
    { nombre: 'Lotus', imagen: 'assets/mapas/lotus.png' },
    { nombre: 'Pearl', imagen: 'assets/mapas/pearl.png' },
    { nombre: 'Breeze', imagen: 'assets/mapas/breeze.png' },
    { nombre: 'Icebox', imagen: 'assets/mapas/icebox.png' },
    { nombre: 'Fracture', imagen: 'assets/mapas/fracture.png' },
    { nombre: 'Sunset', imagen: 'assets/mapas/sunset.png' },
  ];

  constructor(
    private fb: FormBuilder,
    private estrategiasService: EstrategiasService,
    private router: Router,
    private authService: AuthService  // Inyectar el servicio AuthService aquí
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      mapa: ['', Validators.required],
      agentes: [[]],
    });
  }


  toggleAgente(nombre: string): void {
    const agentes = [...this.form.get('agentes')?.value];
    const index = agentes.indexOf(nombre);

    if (index === -1) {
      agentes.push(nombre);
    } else {
      agentes.splice(index, 1);
    }

    this.form.get('agentes')?.setValue(agentes);
    this.form.get('agentes')?.updateValueAndValidity();
  }



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;  // Asegúrate de que esto se esté haciendo correctamente
    }
  }


  onSubmit(): void {
  if (this.form.invalid) {
    return;
  }

  if (!this.selectedFile) {
    this.errorMessage = "El video es obligatorio.";
    return;
  }

  const formData = new FormData();
  formData.append('titulo', this.form.value.titulo);
  formData.append('descripcion', this.form.value.descripcion);
  formData.append('tipo', this.form.value.tipo);
  formData.append('mapa', this.form.value.mapa);
  const agentes = this.form.value.agentes;
  agentes.forEach((agente: string) => {
    formData.append('agentes[]', agente);
  });

  formData.append('video', this.selectedFile);

  const token = this.authService.getToken();

  if (token) {
    this.estrategiasService.crearEstrategia(token, formData).subscribe({
      next: (res) => {
        console.log('Estrategia creada', res);
        this.successMessage = "Estrategia enviada. Pendiente de Revisión.";

        // Limpiar mensaje de error si existía
        this.errorMessage = '';

        // Esperar 1.5 segundos y redirigir
        setTimeout(() => {
          this.router.navigate(['/estrategias']);
        }, 2500);
      },
      error: (err) => {
        console.error('Error al crear estrategia', err);
        if (err.status === 422) {
          this.errorMessage = "Los datos no son válidos. Por favor revisa los campos.";
        } else {
          this.errorMessage = "Error al crear estrategia. Inténtalo de nuevo.";
        }
      },
    });
  } else {
    console.error('No se encontró el token de autenticación');
  }
}


  
}
