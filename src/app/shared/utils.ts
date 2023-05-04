import { UserData } from './shared.interface';

const timeStart = 1683172800;
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

export function formatTime(time: number): string {
  const timeDifference = timeStart + time - Math.floor(Date.now() / 1000);

  const daysToDday = Math.floor(
    timeDifference / (minutesInAnHour * secondsInAMinute * hoursInADay),
  );

  const hoursToDday = Math.floor(
    (timeDifference / (minutesInAnHour * secondsInAMinute)) % hoursInADay,
  );

  const minutesToDday = Math.floor(
    (timeDifference / minutesInAnHour) % secondsInAMinute,
  );

  const secondsToDday = timeDifference % secondsInAMinute;

  return `${zeroPad(daysToDday < 0 ? daysToDday + 1 : daysToDday, 2)}:${zeroPad(
    hoursToDday < 0 ? hoursToDday + 1 : hoursToDday,
    2,
  )}:${zeroPad(
    minutesToDday < 0 ? minutesToDday + 1 : minutesToDday,
    2,
  )}:${zeroPad(secondsToDday < 0 ? secondsToDday + 1 : secondsToDday, 2)}`;
}

export function zeroPad(num: number, size: number) {
  const s = '000000000' + num;
  return s.substr(s.length - size);
}
