import { Injectable } from '@angular/core';
import { Unsubscribe } from '@angular/fire/database';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Users, UsersLogs, userData } from './shared.interface';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db = getDatabase();
  userRef = ref(this.db, 'users/');
  logRef = ref(this.db, 'logs/');

  private userDataSubscription: Unsubscribe | undefined;
  private userData: BehaviorSubject<Users | null> =
    new BehaviorSubject<Users | null>(null);
  public userData$ = this.userData.asObservable();

  emptyUser: userData = {
    name: ``,
    gameTime: 16200,
    team: `undefined`,
    internet: ``,
    mobile: ``,
    email: ``,
    communication: ``,
    powerbank: ``,
    sleepingBag: ``,
    sleepingOutside: 0,
    favoriteDish: ``,
    favoriteToieletPaper: ``,
    favoriteFlower: ``,
    favoriteTransport: ``,
    favoritePub: ``,
    favoritePlace: ``,
    quote: ``,
    recognitionSign: ``,
    startingPoint: ``,
    timeManagement: 0,
    favebookFriends: ``,
    friends: ``,
    placeToLive: ``,
    pricelessItem: ``,
    character: ``,
    happyLife: ``,
    sadLife: ``,
    dreams: ``,
    questionToOthers: ``,
  };

  constructor() {}

  addLog(log: UsersLogs): Promise<any> {
    const uuid = this.getUniqueId(3);
    return update(this.logRef, { [uuid]: log });
  }

  getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  subscribeTodb(): void {
    this.userDataSubscription = onValue(this.userRef, snapshot => {
      console.log('user data', snapshot.val());
      this.userData.next(snapshot.val());
    });
  }

  unsubscribeFromdb(): void {
    if (this.userDataSubscription != null) {
      this.userDataSubscription();
    }
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription != null) {
      this.userDataSubscription();
    }
  }
}
