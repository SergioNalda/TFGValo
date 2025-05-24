import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // IMPORTAR AuthService

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  previewImage: string | ArrayBuffer | null = null;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService  // Cambiar a AuthService
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      profile_photo: [null]
    });
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          description: user.description || ''
        });
        if(user.profile_photo){
          this.previewImage = `http://localhost:8000/storage/${user.profile_photo}`;
        }
        // Actualiza el usuario global en AuthService
        this.authService.setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      },
      error: (err) => {
        this.message = 'Error cargando perfil.';
        console.error(err);
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.profileForm.patchValue({ profile_photo: file });

    const reader = new FileReader();
    reader.onload = () => (this.previewImage = reader.result);
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.message = 'Por favor completa los campos requeridos.';
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    const formData = new FormData();
    formData.append('name', this.profileForm.get('name')?.value ?? '');
    formData.append('description', this.profileForm.get('description')?.value ?? '');

    const photoFile = this.profileForm.get('profile_photo')?.value;
    if (photoFile) {
      formData.append('profile_photo', photoFile);
    }

    this.profileService.updateProfile(formData).subscribe({
      next: (res) => {
        this.message = res.message || 'Perfil actualizado con éxito';

        this.profileService.getProfile().subscribe((updatedUser) => {
          this.authService.setCurrentUser(updatedUser);
          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/estrategias']);
          }, 1000);
        });
      },
      error: (err) => {
        this.message = err.error.message || 'Error actualizando perfil';
        this.loading = false;
      }
    });
  }
}
