import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { PublicPageComponent } from './components/public-page/public-page.component';
import { DraftAuthGuard } from './guards/draft-auth.guard';

export const appRoutes: Routes = [
  { path: '', component: PublicPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [DraftAuthGuard] },
  { path: '**', redirectTo: '' },
];