import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  imports: [CommonModule],
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  error: string | null = null;
  environment = environment;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.userService.getPublicProfile(id).subscribe({
  next: (data) => {
    console.log('User data from API:', data);
    this.user = data;
    this.loading = false;
  },
  error: () => {
    this.error = 'No se pudo cargar el perfil.';
    this.loading = false;
  }
});

}

 goBack() {
    this.router.navigate(['/ranking']); // Ajusta la ruta según cómo sea en tu app
  }

}
