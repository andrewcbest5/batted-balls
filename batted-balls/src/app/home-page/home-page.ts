import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { PlayerStatsService } from '../player-stats';

@Component({
  selector: 'app-home-page',
  imports: [RouterModule, RouterLink, CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private http: HttpClient, private statsService: PlayerStatsService) {}

  ngOnInit() {
     this.loadData();
     console.log('dataSource', this.dataSource);
    }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; 
    this.dataSource.sort = this.sort;
  
  } 
  loadData() {
    this.http.get('BattedBallData.xlsx', { responseType: 'arraybuffer' }).subscribe(data => {
      const workbook = XLSX.read(data, { type: 'array', cellDates: true});
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, {raw: false});

      // removing undefined play outcomes
      const filteredData = jsonData.filter(row => row['PLAY_OUTCOME'] !== 'Undefined');

      const playerStats = this.statsService.calculateStatsByPlayer(filteredData);
      console.log('playerStats', playerStats);
      console.log('filteredData', filteredData);
      this.dataSource.data = playerStats;
      this.displayedColumns = filteredData.length ? Object.keys(playerStats[0]) : [];
    });
  
  }
  

  

}

