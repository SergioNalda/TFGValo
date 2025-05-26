import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      this.router.navigate(['/estrategias']);
      return false;
    }

    const user = JSON.parse(userJson);

    if (user.role_id === 1) {
      return true;
    } else {
      this.router.navigate(['/estrategias']);
      return false;
    }
  }
}
