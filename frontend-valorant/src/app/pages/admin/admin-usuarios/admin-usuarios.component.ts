import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../services/admin-user.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})

export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  modalVisible = false;
  modalMessage = '';
  modalConfirmCallback: (() => void) | null = null;

  notification = '';
  notificationType: 'success' | 'error' | '' = '';

  constructor(private adminUserService: AdminUserService) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.adminUserService.getUsuarios().subscribe(users => {
      this.usuarios = users.map(user => ({
        ...user,
        new_role_id: user.role_id
      }));
    });
  }

  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notification = '';
      this.notificationType = '';
    }, 3500);
  }

  actualizarRol(user: any): void {
    if (user.new_role_id === user.role_id) {
      this.showNotification('El rol seleccionado es igual al actual.', 'error');
      return;
    }

    const updateData = { role_id: user.new_role_id };
    this.adminUserService.updateUsuario(user.id, updateData).subscribe(() => {
      this.showNotification(`Rol de ${user.name} actualizado a ${user.new_role_id === 1 ? 'Admin' : 'Usuario'}.`);
      user.role_id = user.new_role_id;
    }, () => {
      this.showNotification('Error al actualizar rol.', 'error');
      this.getUsuarios();
    });
  }

  eliminarUsuario(id: number): void {
    this.modalMessage = '¿Estás seguro de eliminar este usuario? Esta acción es irreversible.';
    this.modalConfirmCallback = () => {
      this.adminUserService.deleteUsuario(id).subscribe(() => {
        this.showNotification('Usuario eliminado correctamente.');
        this.getUsuarios();
        this.closeModal();
      }, () => {
        this.showNotification('Error al eliminar usuario.', 'error');
        this.closeModal();
      });
    };
    this.modalVisible = true;
  }

  confirmModal(): void {
    if (this.modalConfirmCallback) {
      this.modalConfirmCallback();
    }
  }

  closeModal(): void {
    this.modalVisible = false;
    this.modalMessage = '';
    this.modalConfirmCallback = null;
  }

  searchTerm: string = '';

get filteredUsuarios() {
  let filtered = this.usuarios;

  if (this.searchTerm.trim()) {
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  if (this.sortColumn) {
    filtered = filtered.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Para fechas o números convertimos antes
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
}

sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

sortBy(column: string): void {
  if (this.sortColumn === column) {
    // Cambiar dirección
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // Nueva columna, dirección ascendente
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
}

cambiarEstado(user: any): void {
  const nuevoEstado = user.estado === 1 ? 0 : 1;

  this.adminUserService.updateEstado(user.id, nuevoEstado).subscribe({
    next: () => {
      user.estado = nuevoEstado;
      this.showNotification(`Estado de ${user.name} actualizado a ${nuevoEstado === 1 ? 'Activo' : 'Inactivo'}.`);
    },
    error: () => {
      this.showNotification('Error al actualizar estado.', 'error');
      this.getUsuarios();
    }
  });
}

}
