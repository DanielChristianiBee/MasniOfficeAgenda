import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AgendaComponent } from './home/agenda/agenda.component';
import { AddComponent } from './home/add/add.component';
import { AuthGuard } from './auth.guard'; // Make sure this matches the name of your guard

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protect the home route
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] }, // Protect the agenda route
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] } // Protect the add route
];
