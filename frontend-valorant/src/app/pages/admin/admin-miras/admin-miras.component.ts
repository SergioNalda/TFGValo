import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MiraService } from '../../../services/miras.service';
import { Mira } from '../../../models/mira';

@Component({
  selector: 'app-admin-miras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-miras.component.html',
  styleUrls: ['./admin-miras.component.css']
})
export class AdminMirasComponent implements OnInit {
  miras: Mira[] = [];
  mirasPendientes: Mira[] = [];
  miraForm: FormGroup;
  imagenFile: File | null = null;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  editingMiraId: number | null = null;

  constructor(private miraService: MiraService, private fb: FormBuilder) {
    this.miraForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      tipo: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.loadMiras();
    this.loadMirasPendientes();
  }

  setAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 4000);
  }

  loadMiras() {
    this.miraService.getMiras().subscribe(data => {
      this.miras = data;
    });
  }

  loadMirasPendientes() {
    this.miraService.getMirasPendientes().subscribe(data => {
      this.mirasPendientes = data;
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.imagenFile = event.target.files[0];
    }
  }

  editMira(mira: Mira) {
    this.editingMiraId = mira.id;
    this.miraForm.patchValue({
      nombre: mira.nombre,
      codigo: mira.codigo,
      tipo: mira.tipo
    });
    this.imagenFile = null;
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

    const action$ = this.editingMiraId
      ? this.miraService.updateMira(this.editingMiraId, formData)
      : this.miraService.createMira(formData);

    action$.subscribe({
      next: () => {
        this.setAlert(this.editingMiraId ? 'Mira actualizada con éxito.' : 'Mira creada correctamente.', 'success');
        this.miraForm.reset();
        this.imagenFile = null;
        this.editingMiraId = null;
        this.loadMiras();
        this.loadMirasPendientes();
      },
      error: err => {
        console.error('Error:', err);
        this.setAlert('Ocurrió un error. Revisa los datos o vuelve a intentarlo.', 'error');
      }
    });
  }

  deleteMira(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta mira?')) return;

    this.miraService.deleteMira(id).subscribe({
      next: () => {
        this.setAlert('Mira eliminada correctamente.', 'success');
        this.loadMiras();
      },
      error: () => {
        this.setAlert('Error al eliminar la mira.', 'error');
      }
    });
  }

  aprobarMira(id: number) {
    this.miraService.cambiarEstadoMira(id, 'aprobado').subscribe({
      next: () => {
        this.setAlert('Mira aprobada correctamente', 'success');
        this.loadMiras();
        this.loadMirasPendientes();
      },
      error: () => {
        this.setAlert('Error al aprobar la mira', 'error');
      }
    });
  }

  rechazarMira(id: number) {
    this.miraService.cambiarEstadoMira(id, 'rechazado').subscribe({
      next: () => {
        this.setAlert('Mira rechazada correctamente', 'success');
        this.loadMiras();
        this.loadMirasPendientes();
      },
      error: () => {
        this.setAlert('Error al rechazar la mira', 'error');
      }
    });
  }
}
