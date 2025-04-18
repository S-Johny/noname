import { UserData } from './shared.interface';

const milliSecondsInASecond = 1000;
const hoursInADay = 24;
const minutesInAnHour = 60;
const secondsInAMinute = 60;

export const emptyTask = {
  name: '',
  required: false,
  description: `
  <div class="task-body">
  </div>
`,
  startAt: 1683172800000,
  endAt: 1683547200000,
  reward: '',
  shown: true,
};

export const emptyUser: UserData = {
  name: ``,
  gameTime: 16200,
  team: `undefined`,
  internet: ``,
  mobile: ``,
  email: ``,
  communication: ``,
  powerbank: ``,
  sleepingBag: ``,
  sleepingOutside: 0,
  favoriteDish: ``,
  favoriteToieletPaper: ``,
  favoriteFlower: ``,
  favoriteTransport: ``,
  favoritePub: ``,
  favoritePlace: ``,
  quote: ``,
  recognitionSign: ``,
  startingPoint: ``,
  timeManagement: 0,
  favebookFriends: ``,
  friends: ``,
  placeToLive: ``,
  pricelessItem: ``,
  character: ``,
  happyLife: ``,
  sadLife: ``,
  dreams: ``,
  questionToOthers: ``,
};

export function formatRemainingTime(to: number): string {
  var secondsRemaining = to - Math.floor(Date.now() / 1000);
  var sign = Math.sign(secondsRemaining);
  secondsRemaining = Math.abs(secondsRemaining);

  var daysToDday = Math.floor(
    secondsRemaining / (secondsInAMinute * minutesInAnHour * hoursInADay),
  );

  var hoursToDday = Math.floor(
    (secondsRemaining / (secondsInAMinute * minutesInAnHour)) % hoursInADay,
  );

  var minutesToDday = Math.floor(
    (secondsRemaining / minutesInAnHour) % secondsInAMinute,
  );

  var secondsToDday = secondsRemaining % secondsInAMinute;

  return `${sign < 0 ? '-' : ''
          }${zeroPad(daysToDday, 2)
          }:${zeroPad(hoursToDday, 2,)
          }:${zeroPad(minutesToDday, 2,)
          }:${zeroPad(secondsToDday, 2)}`;
}

export function zeroPad(num: number, size: number) {
  return String(num).padStart(size, '0');
}
