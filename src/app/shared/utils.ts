const timeStart = 1683172800;
const milliSecondsInASecond = 1000;
const hoursInADay = 24;
const minutesInAnHour = 60;
const secondsInAMinute = 60;

export function formatTime(time: number): string {
  const timeDifference = timeStart + time - Math.floor(Date.now() / 1000);

  const daysToDday = zeroPad(
    Math.floor(
      timeDifference / (minutesInAnHour * secondsInAMinute * hoursInADay),
    ),
    2,
  );

  const hoursToDday = zeroPad(
    Math.floor(
      (timeDifference / (minutesInAnHour * secondsInAMinute)) % hoursInADay,
    ),
    2,
  );

  const minutesToDday = zeroPad(
    Math.floor((timeDifference / minutesInAnHour) % secondsInAMinute),
    2,
  );

  const secondsToDday = zeroPad(timeDifference % secondsInAMinute, 2);

  return `${daysToDday}:${hoursToDday}:${minutesToDday}:${secondsToDday}`;
}

export function zeroPad(num: number, size: number) {
  const s = '000000000' + num;
  return s.substr(s.length - size);
}
