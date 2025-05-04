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
  phone: ``,
  email: ``,
  img: ``,
  communication: ``,
  powerbank: ``,
  sleepingBag: ``,
  sleepingOutside: 0,
  favoriteDish: ``,
  favoriteToiletPaper: ``,
  favoritePlant: ``,
  favoriteTransport: ``,
  favoriteInstitute: ``,
  favoritePlace: ``,
  favoriteSong: ``,
  quote: ``,
  recognitionSign: ``,
  startingPoint: ``,
  timeManagement: 0,
  favebookFriends: ``,
  friends: ``,
  placeToLive: ``,
  prizedItem: ``,
  character: ``,
  happyLife: ``,
  sadLife: ``,
  dreams: ``,
  questionToOthers: ``,
};

export function formatRemainingTime(to: number): string {
  let secondsRemaining = to - Math.floor(Date.now() / 1000);
  const sign = Math.sign(secondsRemaining);
  secondsRemaining = Math.abs(secondsRemaining);

  const daysToDday = Math.floor(
    secondsRemaining / (secondsInAMinute * minutesInAnHour * hoursInADay),
  );

  const hoursToDday = Math.floor(
    (secondsRemaining / (secondsInAMinute * minutesInAnHour)) % hoursInADay,
  );

  const minutesToDday = Math.floor(
    (secondsRemaining / minutesInAnHour) % secondsInAMinute,
  );

  const secondsToDday = secondsRemaining % secondsInAMinute;

  return `${sign < 0 ? '-' : ''
          }${zeroPad(daysToDday, 2)
          }:${zeroPad(hoursToDday, 2,)
          }:${zeroPad(minutesToDday, 2,)
          }:${zeroPad(secondsToDday, 2)}`;
}

export function zeroPad(num: number, size: number) {
  return String(num).padStart(size, '0');
}
