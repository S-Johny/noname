import { filter, map, take, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject, combineLatest, takeUntil, interval, Observable } from 'rxjs';
import { DatabaseService } from 'src/app/shared/database.service';
import { formatTime } from 'src/app/shared/utils';
import { Users, userData } from 'src/app/shared/shared.interface';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent {
  public usersObs: Observable<any>;

  constructor(private readonly database: DatabaseService) {
    this.usersObs = this.database.userData$.pipe(
      filter(userData => userData != null),
      map(userData => {
        if (userData == null) return [];
        return Object.keys(userData)
          .reduce<any>((acc, cur) => {
            return [...acc, userData[cur]];
          }, [])
          .sort((a: userData, b: userData) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
          );
      }),
    );
  }

  trackByFn(index: number, item: userData) {
    return item.name;
  }
}
