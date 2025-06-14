import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
