import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { routes } from './navigation.routes';

import { ImageBankComponent } from './components/image-bank/image-bank.component';
import { BrainComponent } from './components/brain/brain.component';
import { NavigationComponent } from './navigation.component';

@NgModule({
  declarations: [
    ImageBankComponent,
    BrainComponent,
    NavigationComponent
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [],
})
export class NavigationModule { }
