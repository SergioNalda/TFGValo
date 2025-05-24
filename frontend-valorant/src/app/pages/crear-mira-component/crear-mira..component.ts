import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MiraService } from '../../services/miras.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-crear-mira',
  templateUrl: './crear-mira.component.html',
  styleUrls: ['./crear-mira.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CrearMiraComponent {
  miraForm: FormGroup;
  imagenFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private miraService: MiraService,
    private router: Router
  ) {
    this.miraForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      tipo: ['', Validators.required],
      imagen: [null]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.imagenFile = event.target.files[0];
    }
  }

  onSubmit() {
  if (this.miraForm.invalid) return;

  const formData = new FormData();
  formData.append('nombre', this.miraForm.get('nombre')?.value);
  formData.append('codigo', this.miraForm.get('codigo')?.value);
  formData.append('tipo', this.miraForm.get('tipo')?.value);

  if (this.imagenFile) {
    formData.append('imagen', this.imagenFile);
  }

  this.miraService.createMira(formData).subscribe({
    next: () => {
      this.mensajeAlerta = 'Mira enviada. Pendiente de revisión.';
      this.alertaVisible = true;

      setTimeout(() => {
        this.alertaVisible = false;
        this.router.navigate(['/miras']);
      }, 2000); // Espera 2 segundos antes de redirigir
    },
    error: () => {
      this.mensajeAlerta = 'Error al crear la mira.';
      this.alertaVisible = true;

      setTimeout(() => {
        this.alertaVisible = false;
      }, 3000);
    }
  });
}


alertaVisible = false;
mensajeAlerta = '';


}
