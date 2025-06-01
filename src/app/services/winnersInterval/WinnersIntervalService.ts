import DatabaseManager from '../../../infra/database/DatabaseManager';
import { Movie } from '../../../infra/typeorm/entities/Movie';

import { IProducersInterval, IWinnersIntervalReturn } from './DTO/winnersIntervalDTO';

class WinnersIntervalService {
  async execute(): Promise<IWinnersIntervalReturn> {
    await DatabaseManager.connect();
    const movieRepository = await DatabaseManager.repository(Movie);

    const winners = await movieRepository.find({
      where: { winner: true },
    });

    const producerWins: Record<string, number[]> = {};

    winners.forEach((movie: { producers: string; year: number }) => {
      const producers = movie.producers
        .split(/,| and /)
        .map((p) => p.trim())
        .filter(Boolean);

      producers.forEach((producer) => {
        if (!producerWins[producer]) {
          producerWins[producer] = [];
        }
        producerWins[producer].push(movie.year);
      });
    });

    const intervals: IProducersInterval[] = [];
    for (const [producer, years] of Object.entries(producerWins)) {
      if (years.length < 2) {
        continue;
      }

      const sortedYears = years.sort((a, b) => a - b);
      for (let i = 0; i < sortedYears.length; i++) {
        intervals.push({
          producer,
          interval: sortedYears[i] - sortedYears[i - 1],
          previousWin: sortedYears[i - 1],
          followingWin: sortedYears[i],
        });
      }
    }

    const filteredIntervals = intervals.filter(
      (i) => Number.isFinite(i.interval) && i.previousWin !== undefined
    );

    if (filteredIntervals.length === 0) {
      return { min: [], max: [] };
    }

    const minInterval = Math.min(...filteredIntervals.map((i) => i.interval));
    const maxInterval = Math.max(...filteredIntervals.map((i) => i.interval));

    return {
      min: filteredIntervals.filter((i) => i.interval === minInterval),
      max: filteredIntervals.filter((i) => i.interval === maxInterval),
    };
  }
}

export default new WinnersIntervalService();
