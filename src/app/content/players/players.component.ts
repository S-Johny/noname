import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable, combineLatestWith, filter, map } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { Team, TeamService } from 'src/app/shared/teams.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent {
  public teamsObs: Observable<Team[]>;
  public homeTeam: boolean = false;

  constructor(
    private readonly auth: AuthService,
    private readonly teams: TeamService
  ) {
    this.teamsObs = this.teams.teams$.pipe(
      combineLatestWith(this.auth.userData$),
      filter(([_, user]) => user !== null),
      map(([teams, user]) => this.moveHomeTeamFirst(teams, user!))
    );
  }

  moveHomeTeamFirst(teams: Team[], user: User) {
    const homeTeamIndex = teams.findIndex(team => {
      Object.keys(team.players).some(key => key == user.uid);
    });
    if (homeTeamIndex >= 0) {
      const [homeTeam] = teams.splice(homeTeamIndex, 1);
      teams.unshift(homeTeam);
      this.homeTeam = true;
    } else {
      this.homeTeam = false;
    }
    return teams;
  }
}
