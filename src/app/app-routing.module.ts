import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './content/home/home.component';

export enum RoutePaths {
  Home = 'home',
}

const routes: Routes = [
  {
    path: RoutePaths.Home,
    component: HomeComponent,
  },
  /*{
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },*/
  {
    path: '**',
    redirectTo: RoutePaths.Home,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
