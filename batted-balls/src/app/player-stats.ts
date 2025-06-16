import { Injectable } from '@angular/core';
import _ from 'lodash';
import ss from 'simple-statistics'

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {

  playerStats: any[] = [];

  constructor() { }

  calculateStatsByPlayer(data: any[]): any[] {
    const grouped = _.groupBy(data, 'BATTER');

    const stats = Object.keys(grouped).map(batter => {
      const rows = grouped[batter];
      const battedBalls = rows.length;
      const hits = rows.filter(r => ['Single', 'Double', 'Triple', 'HomeRun'].includes(r.PLAY_OUTCOME)).length;
      const singles = rows.filter(r => r.PLAY_OUTCOME === 'Single').length;
      const doubles = rows.filter(r => r.PLAY_OUTCOME === 'Double').length;
      const triples = rows.filter(r => r.PLAY_OUTCOME === 'Triple').length;
      const hrs = rows.filter(r => r.PLAY_OUTCOME === 'HomeRun').length;
      const outs = rows.filter(r => ['Out', 'FieldersChoice'].includes(r.PLAY_OUTCOME)).length;
      const sacrifies = rows.filter(r => r.PLAY_OUTCOME === 'Sacrifice').length;
      const avgExitSpeed = _.meanBy(rows, r => Number(r.EXIT_SPEED) || 0);
      const avgLaunchAngle = _.meanBy(rows, r => Number(r.LAUNCH_ANGLE) || 0);
      const avgHitDistance = _.meanBy(rows, r => Number(r.HIT_DISTANCE) || 0);
      const games = _.uniqBy(rows, 'GAME_DATE').length;

      const sweetspot = rows.filter(r => {
        const angle = Number(r.LAUNCH_ANGLE);
        return angle >= 8 && angle <= 32;
      }).length;

      const hardHit = rows.filter(r => Number(r.EXIT_SPEED) >= 95).length;

      return {
        BATTER: batter,
        BATTER_ID: rows[0].BATTER_ID,
        Games: games,
        BattedBalls: battedBalls,
        Hits: hits,
        Singles: singles,
        Doubles: doubles,
        Triples: triples,
        HRs: hrs,
        Outs: outs,
        Sacrifies: sacrifies,
        TotalBases: singles + (2 * doubles) + (3 * triples) + (4 * hrs),
        AvgExitVelo: avgExitSpeed.toFixed(2),
        AvgLaunchAngle: avgLaunchAngle.toFixed(2),
        AvgHitDistance: avgHitDistance.toFixed(2),
        SweetSpot: sweetspot,
        SweetSpotRate: (sweetspot / battedBalls * 100).toFixed(2) ,
        HardHit: hardHit,
        HardHitRate: (hardHit / battedBalls * 100).toFixed(2) ,
      };
    });


    this.playerStats = stats;
    return stats;
    

   
  }
}