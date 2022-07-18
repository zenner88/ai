import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { FotoListComponent } from './pages/foto-list/foto-list.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './_services/auth.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: FotoListComponent },
  { path: '', component: FotoListComponent, canActivate: [AuthService] },
  { path: 'foto-list', component: FotoListComponent, canActivate: [AuthService] },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
    // canActivate: [AuthGuard],

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
