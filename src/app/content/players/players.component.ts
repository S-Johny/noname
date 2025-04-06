import { filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/shared/database.service';
import { UserData } from 'src/app/shared/shared.interface';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  standalone: false,
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
          .sort((a: UserData, b: UserData) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
          );
      }),
    );
  }

  trackByFn(index: number, item: UserData) {
    return item.name;
  }
}
