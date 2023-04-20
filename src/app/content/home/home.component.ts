import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  isDevMode,
  ViewChild,
} from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
export class HomeComponent {
  public timeLeft$: Observable<timeComponents>;
  @ViewChild('homeContainer') homeContainer: ElementRef | undefined;
  audioElement = document.createElement('audio');

  ngAfterViewInit() {
    if (!isDevMode()) {
      this.audioElement.setAttribute('src', 'assets/audio/30sTicTac.mp3');
      this.audioElement.setAttribute('loop', 'true');
      this.audioElement.setAttribute('preload', 'auto');
      this.audioElement.setAttribute('autoplay', 'true');
      this.homeContainer?.nativeElement.appendChild(this.audioElement);
      setTimeout(() => {
        this.audioElement.play();
      }, 5000);
    }
  }

  zeroPad(num: number, size: number) {
    var s = '000000000' + num;
    return s.substr(s.length - size);
  }

  calcDateDiff(
    endDay: Date = new Date(2023, 4, 5, 6, 0, 0, 0),
  ): timeComponents {
    const dDay = endDay.valueOf();

    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;

    const timeDifference = dDay - Date.now();

    const daysToDday = this.zeroPad(
      Math.floor(
        timeDifference /
          (milliSecondsInASecond *
            minutesInAnHour *
            secondsInAMinute *
            hoursInADay),
      ),
      2,
    );

    const hoursToDday = this.zeroPad(
      Math.floor(
        (timeDifference /
          (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) %
          hoursInADay,
      ),
      2,
    );

    const minutesToDday = this.zeroPad(
      Math.floor(
        (timeDifference / (milliSecondsInASecond * minutesInAnHour)) %
          secondsInAMinute,
      ),
      2,
    );

    const secondsToDday = this.zeroPad(
      Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute,
      2,
    );

    const milisecondsToDday = this.zeroPad(
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
}
