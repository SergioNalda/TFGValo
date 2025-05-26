import { Component, OnInit } from '@angular/core';
import { RankingService } from '../../services/ranking.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'  ;
import { HeaderComponent } from '../../shared/header/header.component';


@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, HeaderComponent,RouterLink],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
})
export class RankingComponent implements OnInit {
  ranking: any[] = [];

  constructor(private rankingService: RankingService) {}

  ngOnInit(): void {
    this.getRanking();
  }

  getRanking() {
  this.rankingService.getRanking().subscribe({
    next: (data) => {
      console.log('Ranking data:', data);
      this.ranking = data;
    },
    error: (error) => {
      console.error('Error fetching ranking:', error);
    }
  });
}

}
