import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private user$ = user(this.auth);
  private userSubscription: Subscription;
  private userData: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public userData$ = this.userData.asObservable();

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      this.userData.next(aUser);
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
    });
  }

  async loginToFirebase(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
