import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { Users, UserData } from './shared.interface';

export class Team {
  public name: string;
  public players: Users;

  constructor(name: string, players: Users) {
    this.name = name;
    this.players = players;
  }

  playersData() {
    return Object.values(this.players);
  }
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  public teams$: Observable<Team[]>;

  constructor(private readonly database: DatabaseService) {
    this.teams$ = this.database.userData$.pipe(
      filter(userData => userData != null),
      map(this.teamList),
    );
  }

  /**
   * Transforms raw user data from the database into a list
   * of `Team` objects.
   *
   * @param userData raw user data
   * @returns list of teams
   */
  private teamList(userData: Users) {
    if (userData == null) return [];
    let map = Object.entries(userData)
      .reduce<Map<string, Users>>((teams, entry) => {
        const [userId, user] = entry;
        if (teams.has(user.team)) {
          const team = teams.get(user.team);
          if (team) {
            team[userId] = user;
          }
        } else {
          teams.set(user.team, {userId: user});
        }
        return teams;
      }, new Map<string, Users>());
    const result = [];
    for (const [key, value] of map.entries()) {
      result.push(new Team(key, value));
    }
    return result;
  }
}
