import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  isDevMode,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { zeroPad } from 'src/app/shared/utils';

interface timeComponents {
  milisecondsToDday: string;
  secondsToDday: string;
  minutesToDday: string;
  hoursToDday: string;
  daysToDday: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  public timeLeft$: Observable<timeComponents>;
  @ViewChild('homeContainer') homeContainer: ElementRef | undefined;
  audioElement =
    document.getElementById('audio-tik-tok') != null
      ? document.getElementById('audio-tik-tok')
      : document.createElement('audio');
  bodyElement = document.getElementById('app-body');

  ngAfterViewInit() {
    if (!isDevMode() && this.audioElement != null) {
      this.audioElement.setAttribute('src', 'assets/audio/30sTicTac.mp3');
      this.audioElement.setAttribute('loop', 'true');
      this.audioElement.setAttribute('id', 'audio-tik-tok');
      this.audioElement.setAttribute('preload', 'auto');
      this.audioElement.setAttribute('autoplay', 'true');
      if (this.bodyElement != null) {
        this.bodyElement.appendChild(this.audioElement);
        setTimeout(() => {
          if (this.audioElement != null) {
            (this.audioElement as any).play();
          }
        }, 5000);
      }
    }
  }

  calcDateDiff(
    endDay: Date = new Date('2023-05-04T04:00:00Z'),
  ): timeComponents {
    const dDay = endDay.valueOf();

    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;

    const timeDifference = dDay - Date.now();

    const daysToDday = zeroPad(
      Math.floor(
        timeDifference /
          (milliSecondsInASecond *
            minutesInAnHour *
            secondsInAMinute *
            hoursInADay),
      ),
      2,
    );

    const hoursToDday = zeroPad(
      Math.floor(
        (timeDifference /
          (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
          hoursInADay,
      ),
      2,
    );

    const minutesToDday = zeroPad(
      Math.floor(
        (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
          secondsInAMinute,
      ),
      2,
    );

    const secondsToDday = zeroPad(
      Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute,
      2,
    );

    const milisecondsToDday = zeroPad(
      Math.floor(timeDifference % milliSecondsInASecond),
      3,
    );

    return {
      milisecondsToDday,
      secondsToDday,
      minutesToDday,
      hoursToDday,
      daysToDday,
    };
  }

  constructor() {
    this.timeLeft$ = interval(50).pipe(
      map(x => this.calcDateDiff()),
      shareReplay(1),
    );
  }

  ngOnDestroy(): void {
    if (this.bodyElement != null) {
      (this.audioElement as any).pause();
      setInterval(() => {
        (this.audioElement as any).pause();
      }, 1000);
    }
  }
}
