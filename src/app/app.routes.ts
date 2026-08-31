import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { PublicPageComponent } from './components/public-page/public-page.component';

export const appRoutes: Routes = [
  { path: '', component: PublicPageComponent, pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];