import { Pipe, PipeTransform } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { ConfigService } from './config.service';
import { formatRemainingTime } from './utils';

@Pipe({
  name: 'timeCountdown',
  standalone: false,
})
export class TimeCountdownPipe implements PipeTransform {
  eventStart : number;

  constructor(config : ConfigService) {
    this.eventStart = config.getEventStart().getTime() / 1000;
  }

  transform(gameTime: number): Observable<string> {
    var time = this.epochTime(gameTime);
    return interval(1000).pipe(map(() => formatRemainingTime(time)));
  }

  epochTime(gameTime: number) {
    return this.eventStart + gameTime;
  }
}
