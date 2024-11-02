import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FirebaseService } from './firebase.service'; // Import your Firebase service
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MasniOfficeAgenda';
  showHomeButton: boolean = false; // Flag for Home button visibility
  showLogoutButton: boolean = false; // Flag for Logout button visibility

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Subscribe to router events to control button visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateButtonVisibility(event.url);
    });
  }

  private updateButtonVisibility(url: string) {
    // Hide the Home and Logout buttons if the current URL is '/login'
    this.showHomeButton = url !== '/login';
    this.showLogoutButton = url !== '/login' && this.firebaseService.isLoggedIn(); // Assuming you have an isLoggedIn method
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.firebaseService.logout().then(() => {
      this.router.navigate(['/login'], { replaceUrl: true }); // Use replaceUrl to block back navigation
    });
  }
  
}
