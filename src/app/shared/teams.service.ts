import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { Users, UserData } from './shared.interface';

export class Team {
  public name: string;
  public players: [UserData];

  constructor(name: string, players: [UserData]) {
    this.name = name;
    this.players = players;
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
    let map = Object.values(userData)
      .reduce<Map<string, [UserData]>>((teams, user) => {
        console.log(teams);
        console.log(user);
        if (teams.has(user.team)) {
          teams.get(user.team)?.push(user);
        } else {
          teams.set(user.team, [user]);
        }
        return teams;
      }, new Map<string, [UserData]>());
    const result = [];
    for (const [key, value] of map.entries()) {
      result.push(new Team(key, value));
    }
    return result;
  }
}
