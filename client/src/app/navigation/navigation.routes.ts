import { Routes } from '@angular/router';

import { NavigationComponent } from './navigation.component';
import { ImageBankComponent } from './components/image-bank/image-bank.component';
import { BrainComponent } from './components/brain/brain.component';

export const routes : Routes = [
    { path: 'navigation/:id', component: NavigationComponent,
        children: [
            { path: '', component: BrainComponent,  pathMatch: 'full' },
            { path: 'imageBank', component: ImageBankComponent },
            { path: 'brain', component: BrainComponent }
        ]
    }
];