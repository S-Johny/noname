import { RulesComponent } from './content/rules/rules.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './content/home/home.component';
import { LogsComponent } from './content/logs/logs.component';
import { TasksComponent } from './content/tasks/tasks.component';
import { PlayersComponent } from './content/players/players.component';

export enum RoutePaths {
  Home = 'home',
  Rules = 'rules',
  Logs = 'logs',
  Tasks = 'tasks',
  Players = 'players',
}

export const routes: Routes = [
  {
    path: RoutePaths.Home,
    component: HomeComponent,
  },
  {
    path: RoutePaths.Rules,
    component: RulesComponent,
  },
  {
    path: RoutePaths.Logs,
    component: LogsComponent,
  },
  {
    path: RoutePaths.Tasks,
    component: TasksComponent,
  },
  {
    path: RoutePaths.Players,
    component: PlayersComponent,
  },
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
