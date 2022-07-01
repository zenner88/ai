import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { FotoListComponent } from './pages/foto-list/foto-list.component';

const routes: Routes = [
  { path: '',      component: FotoListComponent },
  { path: 'dashboard',      component: FotoListComponent },
  { path: 'foto-list',      component: FotoListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
