import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import { Movie } from '../../../infra/typeorm/entities/Movie';
import DatabaseManager from '../../../infra/database/DatabaseManager';
import excelMovieValidationSchema from '../../../utils/validation/excelMovieValidationSchema';

class LoadExcelFile {
  async execute() {
    const filePath = path.join(__dirname, '../../files/movielist.csv');
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    await DatabaseManager.connect();
    const movieRepository = await DatabaseManager.repository(Movie);

    let promiseSaveMovie: Promise<void>[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ';', columns: true }))
      .on('data', async (row) => {
        const { error, value } = excelMovieValidationSchema.validate(row);
        if (error) {
          console.log(`Invalid row: ${JSON.stringify(row)} - ${error.message}`);
          return;
        }

        const year = parseInt(value.year, 10);
        const title = value.title?.trim();
        const studios = value.studios?.trim();
        const producers = value.producers?.trim();
        const winner = value.winner?.trim().toLowerCase() === 'yes';

        const movie = movieRepository.create({
          year,
          title,
          studios,
          producers,
          winner,
        });

        const savePromise = movieRepository
          .save(movie)
          .catch((error: any) =>
            console.error(`Error processing row: ${JSON.stringify(row)}`, error)
          );

        promiseSaveMovie.push(savePromise);
      })
      .on('end', async () => {
        await Promise.all(promiseSaveMovie);
        console.log('CSV file processing completed.');
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
      });
  }
}

export default new LoadExcelFile();
