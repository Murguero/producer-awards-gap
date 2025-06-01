export interface IProducersInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface IWinnersIntervalReturn {
  min: IProducersInterval[];
  max: IProducersInterval[];
}
