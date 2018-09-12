import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {RouterModule} from '@angular/router';
import { routes } from './navigation.routes';

import { ImageBankComponent } from './components/image-bank/image-bank.component';
import { BrainComponent } from './components/brain/brain.component';
import { NavigationComponent } from './navigation.component';
import { NavigationService } from './services/navigation.service';
import { ConfService } from './services/conf.service';
import { BrainElementDirective } from './directives/brain-element.directive';

@NgModule({
  declarations: [
    ImageBankComponent,
    BrainComponent,
    NavigationComponent,
    BrainElementDirective
  ],
  imports: [
    BrowserModule,
    RouterModule.forChild(routes) //
  ],
  providers: [NavigationService, ConfService],
})
export class NavigationModule { }
