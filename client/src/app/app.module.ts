import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AuthGuard, NotAuthGuard } from './guards/auth.guard';
import { SearchPipe, SearchOriginPipe } from './pipes/search.pipe';
import { NavigationModule } from './navigation/navigation.module';
import { HeaderComponent } from './layouts/header/header.component';
import { AnimationComponent } from './components/animation/animation.component';
import { HeaderService } from './layouts/header.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    SearchPipe,
    SearchOriginPipe,
    HeaderComponent,
    AnimationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    NavigationModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [
    ValidateService, 
    AuthService, 
    AuthGuard, 
    NotAuthGuard,
    HeaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
