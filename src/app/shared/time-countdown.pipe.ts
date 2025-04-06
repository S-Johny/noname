import { Pipe, PipeTransform } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { formatTime } from './utils';

@Pipe({
  name: 'timeCountdown',
  standalone: false,
})
export class TimeCountdownPipe implements PipeTransform {
  transform(gameTime: number): Observable<string> {
    return interval(1000).pipe(map(() => formatTime(gameTime)));
  }
}
