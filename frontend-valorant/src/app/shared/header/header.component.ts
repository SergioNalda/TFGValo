import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

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

  constructor(
    private authService: AuthService,
    private eRef: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.name = user?.name || null;
      this.profilePhoto = user?.profile_photo
        ? `${environment.apiUrl.replace('/api', '')}/storage/${user.profile_photo}`
        : null;
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
    this.router.navigate(['/editar-perfil']);
  }

  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
