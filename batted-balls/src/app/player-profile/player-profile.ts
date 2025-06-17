import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerStatsService } from '../player-stats';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import * as ss from 'simple-statistics';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';


@Component({
  selector: 'app-player-profile',
  imports: [ MatTableModule, CommonModule],
  templateUrl: './player-profile.html',
  styleUrl: './player-profile.css'
})
export class PlayerProfile {
  playerName = '';
  playerStats: any = null;
  allStats: any[] = [];
  displayedColumns: string[] = ['stat', 'value'];
  dataSource = new MatTableDataSource<any>([]);
  percentiles: any[] = [];
  

  constructor(private route: ActivatedRoute, private statsService: PlayerStatsService) {
    this.route.paramMap.subscribe(params => {
      this.playerName = params.get('batter') || '';
      this.loadPlayerStats();
      console.log('Player Name:', this.playerName);
      console.log('Data Source:', this.dataSource.data);
      console.log('All Stats:', this.allStats);
      console.log('Player Stats:', this.playerStats);
      this.percentiles = this.getSummaryStatsTable()
      console.log('Percentiles:', this.percentiles);
    });
  }

  loadPlayerStats() {
    this.allStats = this.statsService.playerStats || [];
    this.playerStats = this.allStats.find((row: any) => row.BATTER === this.playerName);
    if (this.playerStats) {
      const statsArray = Object.entries(this.playerStats)
        .filter(([key]) => key !== 'BATTER' && key !== 'BATTER_ID')
        .map(([stat, value]) => ({ stat, value }));
      this.dataSource.data = statsArray;
    }
  }
 
  getSummaryStatsTable(): { stat: string, value: string | number, percentile: string | number }[] {
  if (!this.playerStats || !this.statsService.playerStats) return [];

  const statMap: { [key: string]: string } = {
    AvgExitVelo: 'Avg Exit Velo',
    AvgHitDistance: 'Avg Hit Distance',
    SweetSpotRate: 'Sweet Spot %',
    HardHitRate: 'Hard Hit %'
  };

  const keys = Object.keys(statMap);

  // Calculate percentiles here
  const percentiles: { [key: string]: number } = {};
  keys.forEach(key => {
    const values = this.statsService.playerStats
      .map((s: any) => Number(s[key]))
      .filter(v => !isNaN(v))
      .sort((a, b) => a - b);
    const playerValue = Number(this.playerStats[key]);
    percentiles[key] = values.length && !isNaN(playerValue)
      ? Math.round(ss.quantileRankSorted(values, playerValue) * 100)
      : NaN;
  });

  return keys.map(key => ({
    stat: statMap[key],
    value: this.playerStats[key],
    percentile: !isNaN(percentiles[key]) ? percentiles[key] : 'N/A'
  }));
}
getPercentileColor(percentile: number | string): string {
  if (percentile === 'N/A' || isNaN(Number(percentile))) {
    return '#e0e0e0';
  }
  const p = Number(percentile) / 100;
  // Interpolate directly between blue and red
  const r = Math.round(25 + (211 - 25) * p);
  const g = Math.round(118 + (47 - 118) * p);
  const b = Math.round(210 + (47 - 210) * p);
  return `rgb(${r},${g},${b})`;
}
}
