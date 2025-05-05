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
  mobile: string;
  email: string;
  communication: string;
  powerbank: string;
  sleepingBag: string;
  sleepingOutside: number;
  favoriteDish: string;
  favoriteToieletPaper: string;
  favoriteFlower: string;
  favoriteTransport: string;
  favoritePub: string;
  favoritePlace: string;
  quote: string;
  recognitionSign: string;
  startingPoint: string;
  timeManagement: number;
  favebookFriends: string;
  friends: string;
  placeToLive: string;
  pricelessItem: string;
  character: string;
  happyLife: string;
  sadLife: string;
  dreams: string;
  questionToOthers: string;
}

export interface ConfigData {
  timeFactorMyTeam: number;
  timeFactorGift: number;
  timeFactorSomeoneOther: number;
}
