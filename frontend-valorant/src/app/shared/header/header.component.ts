import { Component, OnInit, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  name: string | null = null;
  dropdownOpen = false;
  profilePhoto: string | null = null;

  constructor(private authService: AuthService, private eRef: ElementRef,private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.name = user?.name || null;
      this.profilePhoto = user?.profile_photo ? `http://localhost:8000/storage/${user.profile_photo}` : null;
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
  }

  editProfile(): void {
  this.dropdownOpen = false;
  this.router.navigate(['/editar-perfil']); // Redirige sin alert
}

  // 🔍 Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
