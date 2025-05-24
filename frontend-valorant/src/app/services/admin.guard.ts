import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser')!);

    if (user && user.role_id === 1) {
      return true;
    } else {
      this.router.navigate(['/estrategias']);
      return false;
    }
  }
}
