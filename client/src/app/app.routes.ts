import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AuthGuard, NotAuthGuard } from './guards/auth.guard';

//import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes =  [
    {path:'', component: HomeComponent},
    {path:'register', component: RegisterComponent, canActivate:[NotAuthGuard]},
    {path:'login', component: LoginComponent, canActivate:[NotAuthGuard]},
    {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
    {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
    {path:'**', component: HomeComponent},
    // {
    //     path: 'dashboard',
    //     loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
    //     data: {preload: true}
    // },
  ];