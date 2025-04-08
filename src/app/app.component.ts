import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { RoutePaths } from './app-routing.module';
import { AuthService } from './shared/auth.service';
import { ConfigService } from './shared/config.service';
import { DatabaseService } from './shared/database.service';

enum AuthAction {
  Login = 'Login',
  Logout = 'Logout',
}

const DEFAULT_MENU = [
  {
    icon: '',
    title: 'Domů',
    url: RoutePaths.Home,
  },
  {
    icon: '',
    title: 'Přihlásit',
    url: AuthAction.Login,
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  sidnavButtons = DEFAULT_MENU;
  private configService: ConfigService = inject(ConfigService);
  siteName: String = "Noname";
  private unsubscribe = new Subject();
  userName: string | null = null;

  constructor(
    public readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly database: DatabaseService,
  ) {
    console.log('remote', this.siteName);
    this.authService.userData$
      .pipe(
        takeUntil(this.unsubscribe),
        tap(user => {
          if (user) {
            this.userName = user.displayName;
            this.sidnavButtons = [
              {
                icon: '',
                title: 'Domů',
                url: RoutePaths.Home,
              },
              {
                icon: '',
                title: 'Pravidla',
                url: RoutePaths.Rules,
              },
              {
                icon: '',
                title: 'Úkoly',
                url: RoutePaths.Tasks,
              },
              {
                icon: '',
                title: 'Logy',
                url: RoutePaths.Logs,
              },
              {
                icon: '',
                title: 'Hráči',
                url: RoutePaths.Players,
              },
              {
                icon: '',
                title: 'Odhlásit',
                url: AuthAction.Logout,
              },
            ];
            this.database.subscribeTodb();
          } else {
            this.userName = null;
            this.sidnavButtons = DEFAULT_MENU;
          }
        }),
      )
      .subscribe();
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate([RoutePaths.Home]);
        this.sidnavButtons = DEFAULT_MENU;
        this.database.unsubscribeFromdb();
      })
      .catch(e => console.log(e.message));
  }

  lastButton(last: AuthAction | RoutePaths) {
    if (last === AuthAction.Logout) {
      this.logout();
    } else {
      this.openDialog();
    }
  }

  openDialog(): void {
    this.dialog.open(AppLoginDialogComponent);
  }

  async ngOnInit() {
    await this.configService.initializeConfig();
    this.siteName = this.configService.getString('title');
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'app-login-dialog.html',
  styleUrls: ['./app-login-dialog.scss'],
  standalone: false,
})
export class AppLoginDialogComponent {
  loginForm: FormGroup;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  constructor(
    private readonly authService: AuthService,
    public dialogRef: MatDialogRef<AppLoginDialogComponent>,
    private readonly fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  close(): void {
    console.log('close');
    this.dialogRef.close();
  }

  login(): void {
    if (
      this.loginForm.valid &&
      this.loginForm.get('email') != null &&
      this.loginForm.get('password') != null
    ) {
      this.authService
        .loginToFirebase(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value,
        )
        .then(user => {
          if (user != null) {
            this.dialogRef.close();
          }
        })
        .catch(error => alert(error));
    }
  }
}
