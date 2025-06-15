import { Injectable } from '@angular/core';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {

  constructor() { }

  calculateStatsByPlayer(data: any[]): any[] {
    const grouped = _.groupBy(data, 'BATTER');

    return Object.keys(grouped).map(batter => {
      const rows = grouped[batter];
      const battedBalls = rows.length;
      const hits = rows.filter(r => ['Single', 'Double', 'Triple', 'HomeRun'].includes(r.PLAY_OUTCOME)).length;
      const singles = rows.filter(r => ['Single'].includes(r.PLAY_OUTCOME)).length;
      const doubles = rows.filter(r => ['Double'].includes(r.PLAY_OUTCOME)).length;
      const triples = rows.filter(r => ['Triple'].includes(r.PLAY_OUTCOME)).length;
      const hrs = rows.filter(r => ['HomeRun'].includes(r.PLAY_OUTCOME)).length;
      const outs = rows.filter(r => ['Out', 'FieldersChoice'].includes(r.PLAY_OUTCOME)).length;
      const sacrifies = rows.filter(r => ['Sacrifice'].includes(r.PLAY_OUTCOME)).length;
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
        AvgExitVelo : avgExitSpeed.toFixed(2),
        AvgLaunchAngle: avgLaunchAngle.toFixed(2),
        AvgHitDistance: avgHitDistance.toFixed(2),
        SweetSpot: sweetspot,
        SweetSpotRate: (sweetspot / battedBalls * 100).toFixed(2) + '%',
        HardHit: hardHit,
        HardHitRate: (hardHit / battedBalls * 100).toFixed(2) + '%',
      };
    });
  }
}
