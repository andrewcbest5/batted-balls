import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { PlayerProfile } from './player-profile/player-profile';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'player-profile' , component: PlayerProfile },
];