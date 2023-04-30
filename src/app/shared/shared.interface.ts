export interface UsersLogs {
  description: string;
  fromId: string;
  fromName: string;
  forId: string;
  forName: string;
  witnessId: string;
  witnessName: string;
  time: number;
}

export interface Users {
  [key: string]: userData;
}

export interface userData {
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
