import { firebaseConfig } from './../../.project/firebase.config';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, AppLoginDialogComponent } from './app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HomeComponent } from './content/home/home.component';
import { RulesComponent } from './content/rules/rules.component';
import { AuthService } from './shared/auth.service';
import { TasksComponent } from './content/tasks/tasks.component';
import { LogsComponent } from './content/logs/logs.component';
import { DatabaseService } from './shared/database.service';
import { PlayersComponent } from './content/players/players.component';
import { TimeCountdownPipe } from './shared/time-countdown.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RulesComponent,
    AppLoginDialogComponent,
    TasksComponent,
    LogsComponent,
    PlayersComponent,
    TimeCountdownPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideRemoteConfig(() => getRemoteConfig()),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    MatCommonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [AuthService, DatabaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
