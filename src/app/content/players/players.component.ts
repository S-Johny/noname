import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, TeamService } from 'src/app/shared/teams.service';
import { UserData } from 'src/app/shared/shared.interface';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent {
  public teamsObs: Observable<Team[]>;

  constructor(private readonly teams: TeamService) {
    this.teamsObs = this.teams.teams$;
  }

  trackByFn(index: number, item: UserData) {
    return item.name;
  }
}
