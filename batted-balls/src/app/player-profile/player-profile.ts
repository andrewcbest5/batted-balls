import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-profile',
  imports: [],
  templateUrl: './player-profile.html',
  styleUrl: './player-profile.css'
})
export class PlayerProfile {
  playerName = '';

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.playerName = params.get('batter') || '';
    });
  }
}
