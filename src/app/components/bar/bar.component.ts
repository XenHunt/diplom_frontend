import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [MatButton],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.css'
})
export class BarComponent {
navigateToHomePage() {
  if (this.router.url !== '/')
    this.router.navigate(['/']);
}
  constructor(private router: Router) { 
  }
  
  navigateToUploadPage() {
    if (this.router.url !== '/upload')
      this.router.navigate(['/upload']);
  }
}
