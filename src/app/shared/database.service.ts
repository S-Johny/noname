import { Injectable } from '@angular/core';
import {
  Unsubscribe,
  child,
  equalTo,
  orderByChild,
  orderByValue,
  push,
  query,
} from '@angular/fire/database';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { Users, UsersLog, UserData, TaskData } from './shared.interface';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db = getDatabase();
  userRef = ref(this.db, 'users/');
  logRef = query(ref(this.db, 'logs/'), orderByChild('timestamp'));
  tasksRef = query(
    ref(this.db, 'tasks/'),
    orderByChild('shown'),
    equalTo(true),
  );

  private userDataSubscription: Unsubscribe | undefined;
  private logDataSubscription: Unsubscribe | undefined;
  private taskDataSubscription: Unsubscribe | undefined;

  private userData: BehaviorSubject<Users | null> =
    new BehaviorSubject<Users | null>(null);
  public userData$ = this.userData.asObservable();

  private userOptions: BehaviorSubject<{ userId: string; name: string }[]> =
    new BehaviorSubject<{ userId: string; name: string }[]>([]);
  public userOptions$ = this.userOptions.asObservable();

  private teamOptions: BehaviorSubject<
    { teamMembers: string[]; teamName: string }[]
  > = new BehaviorSubject<{ teamMembers: string[]; teamName: string }[]>([]);
  public teamOptions$ = this.teamOptions.asObservable();

  public logs: BehaviorSubject<UsersLog[]> = new BehaviorSubject<UsersLog[]>(
    [],
  );
  public logs$ = this.logs.asObservable();

  public tasks: BehaviorSubject<TaskData[]> = new BehaviorSubject<TaskData[]>(
    [],
  );
  public tasks$ = this.tasks.asObservable();

  constructor() {}

  uploadTask(task: TaskData) {
    const newTaskKey = push(child(ref(this.db), 'tasks')).key;
    update(ref(this.db), { ['tasks/' + newTaskKey]: task });
  }

  updateDatabaseTimeAndLog(users: Users, log: UsersLog) {
    const newLogKey = push(child(ref(this.db), 'logs')).key;
    return update(ref(this.db), { ...users, ['logs/' + newLogKey]: log });
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
      const users = snapshot.val();
      this.userData.next(users);
      if (users != null) {
        this.userOptions.next(
          Object.keys(users)
            .reduce<any>((acc, cur) => {
              return [...acc, { userId: cur, name: users[cur].name }];
            }, [])
            .sort((a: UserData, b: UserData) =>
              a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
            ),
        );

        this.teamOptions.next(
          Object.keys(users).reduce<any>((acc, cur) => {
            const teamName = users[cur].team;
            const teamIndex = acc.findIndex(
              (team: { teamName: string }) => team.teamName === teamName,
            );
            if (teamIndex != -1) {
              acc[teamIndex].teamMembers = [...acc[teamIndex].teamMembers, cur];
              return acc;
            }
            return [...acc, { teamMembers: [cur], teamName: teamName }];
          }, []),
        );
      }
    });
  }

  subscribeToLogdb(): void {
    this.logDataSubscription = onValue(this.logRef, snapshot => {
      const logObj = snapshot.val();
      this.logs.next(
        Object.keys(logObj).reduce<any>((acc, cur) => {
          return [...acc, { ...logObj[cur] }];
        }, []),
      );
    });
  }

  subscribeToTasksdb(): void {
    this.taskDataSubscription = onValue(this.tasksRef, snapshot => {
      const taskObj = snapshot.val();
      this.tasks.next(
        Object.keys(taskObj).reduce<any>((acc, cur) => {
          return [...acc, { ...taskObj[cur] }];
        }, []),
      );
    });
  }

  unsubscribeToTasksdb(): void {
    if (this.taskDataSubscription != null) {
      this.taskDataSubscription();
    }
  }

  unsubscribeToLogdb(): void {
    if (this.logDataSubscription != null) {
      this.logDataSubscription();
    }
  }

  unsubscribeFromdb(): void {
    if (this.userDataSubscription != null) {
      this.userDataSubscription();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromdb();
    this.unsubscribeToLogdb();
  }
}
