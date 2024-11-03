import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AgendaComponent } from './home/agenda/agenda.component';
import { AddComponent } from './home/add/add.component';
import { AuthGuard } from './auth.guard'; 

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent }, 
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] }, 
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] } 
];
