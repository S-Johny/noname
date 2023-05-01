import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { DatabaseService } from 'src/app/shared/database.service';
import { UserData, UsersLog } from 'src/app/shared/shared.interface';

enum optionsType {
  Me = 'me',
  MyTeam = 'myTeam',
  SomeoneOther = 'someoneOther',
  Gift = 'gift',
}
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent implements OnInit {
  logForm: FormGroup;
  logOptions: { value: string; label: string; description: string }[] = [
    {
      value: optionsType.Me,
      label: 'Pro mě',
      description: `Donstaneš 100% času`,
    },
    {
      value: optionsType.MyTeam,
      label: 'Tým',
      description: `Každý z tvého týmu dostane (90% času) / počet členů`,
    },
    {
      value: optionsType.Gift,
      label: 'Dárek',
      description: `Tobě se strhne 100% a dotyčný/á dostane 80% času`,
    },
    {
      value: optionsType.SomeoneOther,
      label: 'Ostatní',
      description: `Zadávání ze někoho. Dotyčný/á dostane 85% času`,
    },
  ];

  optionType = optionsType;
  userOptions = this.database.userOptions$;
  teamOptions = this.database.teamOptions$;
  teamSelected = '';

  dataSource = new LogsDataSource(this.database);
  displayedColumns: string[] = [
    'forName',
    'fromName',
    'witnessName',
    'time',
    'description',
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly database: DatabaseService,
  ) {
    this.logForm = this.fb.group({
      logOption: [optionsType.Me],
      time: [null, [Validators.required]],
      description: ['', [Validators.required]],
      forId: [null, [Validators.required]],
      witnessId: ['', [Validators.required]],
      fromId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.database.subscribeToLogdb();
  }

  setTeam(team: string): void {
    this.teamSelected = team;
  }

  clearForId(): void {
    this.logForm.get('forId')?.reset();
  }

  async addNewLog(): Promise<void> {
    if (this.logForm.value.time <= 0) {
      return;
    }
    const timeInSeconds = this.logForm.value.time * 60;
    const users = await firstValueFrom(this.database.userData$);
    if (users == null) {
      return;
    }
    const witness = users[this.logForm.value.witnessId];
    const fromUser = users[this.logForm.value.fromId];
    const forUser =
      this.logForm.value.logOption === optionsType.MyTeam
        ? this.teamSelected
        : users[this.logForm.value.forId];
    const logBase = {
      description: this.logForm.value.description,
      fromName: fromUser.name,
      forName: '',
      witnessName: witness.name,
      time: this.logForm.value.time,
      timeStamp: Date.now(),
    };
    switch (this.logForm.value.logOption) {
      case optionsType.Me:
        this.database.updateDatabaseTimeAndLog(
          {
            ['users/' + (this.logForm.value.forId as string)]: {
              ...(<UserData>forUser),
              gameTime: timeInSeconds + (forUser as UserData).gameTime,
            },
          },
          { ...logBase, forName: (forUser as UserData).name },
        );
        break;

      case optionsType.MyTeam:
        const gameTime = Math.floor(
          timeInSeconds / 90 / this.logForm.value.forId.length,
        );
        console.log('game time team', gameTime);
        const updates: any = {};
        this.logForm.value.forId.forEach((item: string) => {
          updates['users/' + item] = {
            ...users[item],
            gameTime: users[item].gameTime + gameTime,
          };
        });
        this.database.updateDatabaseTimeAndLog(updates, {
          ...logBase,
          forName: forUser as string,
        });
        break;

      case optionsType.SomeoneOther:
        this.database.updateDatabaseTimeAndLog(
          {
            ['users/' + (this.logForm.value.forId as string)]: {
              ...(<UserData>forUser),
              gameTime:
                Math.floor(timeInSeconds / 85) + (forUser as UserData).gameTime,
            },
          },
          { ...logBase, forName: (forUser as UserData).name },
        );
        break;

      case optionsType.Gift:
        const cutTime = fromUser.gameTime - timeInSeconds;
        if (cutTime < 0) {
          return;
        }
        this.database.updateDatabaseTimeAndLog(
          {
            ['users/' + (this.logForm.value.forId as string)]: {
              ...(<UserData>forUser),
              gameTime:
                Math.floor(timeInSeconds / 80) + (forUser as UserData).gameTime,
            },
            ['users/' + (this.logForm.value.fromId as string)]: {
              ...(<UserData>fromUser),
              gameTime: cutTime,
            },
          },
          { ...logBase, forName: (forUser as UserData).name },
        );
        break;
    }
  }
}

class LogsDataSource extends DataSource<UsersLog> {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  connect(): Observable<UsersLog[]> {
    return this.database.logs;
  }

  disconnect() {}

  setData(data: UsersLog[]) {
    this.database.logs.next(data);
  }
}
