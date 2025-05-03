export interface Logs {
  [key: string]: UsersLog;
}

export interface Users {
  [key: string]: UserData;
}

export interface Tasks {
  [key: string]: TaskData;
}

export interface TaskData {
  name: string;
  description: string;
  required: boolean;
  startAt: number;
  endAt: number;
  reward: string;
  shown: boolean;
}

export interface UsersLog {
  description: string;
  fromName: string;
  forName: string;
  witnessName: string;
  time: number;
  timeStamp: number;
}
export interface UserData {
  name: string;
  gameTime: number;
  team: string;
  internet: string;
  phone: string;
  email: string;
  communication: string;
  powerbank: string;
  sleepingBag: string;
  sleepingOutside: number;
  favoriteDish: string;
  favoriteToiletPaper: string;
  favoritePlant: string;
  favoriteTransport: string;
  favoriteInstitute: string;
  favoritePlace: string;
  favoriteSong: string;
  quote: string;
  recognitionSign: string;
  startingPoint: string;
  timeManagement: number;
  favebookFriends: string;
  friends: string;
  placeToLive: string;
  prizedItem: string;
  character: string;
  happyLife: string;
  sadLife: string;
  dreams: string;
  questionToOthers: string;
}
