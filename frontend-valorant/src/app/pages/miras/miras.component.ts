import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiraService } from '../../services/miras.service';
import { Mira } from '../../models/mira';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-miras',
  templateUrl: './miras.component.html',
  styleUrls: ['./miras.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderComponent
  ],
})
export class MirasComponent {
  miras: Mira[] = [];
  searchText: string = '';
  tipoSeleccionado: string = 'all';
  modalAbierto = false;
  miraSeleccionada: Mira | null = null;

  codigoCopiado = false;

  constructor(private miraService: MiraService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarMiras();
  }

  cargarMiras() {
    this.miraService.getMiras().subscribe(data => {
      this.miras = data;
    });
  }

  abrirModal(mira: Mira) {
    this.miraSeleccionada = mira;
    this.modalAbierto = true;
  }

  cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.classList.add('hide');
      setTimeout(() => {
        this.modalAbierto = false;
        modal.classList.remove('hide');
      }, 300);
    } else {
      this.modalAbierto = false;
    }
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.miraSeleccionada?.codigo || '');
    this.codigoCopiado = true;

    const btn = document.querySelector('.modal-content button');
    btn?.classList.add('copied');

    setTimeout(() => {
      this.codigoCopiado = false;
      btn?.classList.remove('copied');
    }, 1500);
  }

  get mirasFiltradas(): Mira[] {
    return this.miras
      .filter(mira =>
        this.tipoSeleccionado === 'all' ||
        mira.tipo?.toLowerCase() === this.tipoSeleccionado.toLowerCase()
      )
      .filter(mira =>
        mira.nombre?.toLowerCase().includes(this.searchText.toLowerCase())
      );
  }

}
