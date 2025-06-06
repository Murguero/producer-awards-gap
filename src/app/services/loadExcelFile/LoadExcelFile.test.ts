import LoadExcelFile from './LoadExcelFile';
import DatabaseManager from '../../../infra/database/DatabaseManager';
import excelMovieValidationSchema from '../../../utils/validation/excelMovieValidationSchema';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path');
jest.mock('../../../infra/database/DatabaseManager');
jest.mock('../../../utils/validation/excelMovieValidationSchema');
jest.mock('csv-parse', () => ({
  parse: jest.fn(),
}));
jest.mock('app-root-path', () => ({
  toString: () => '',
}));
jest.mock('../../../config/dataSource', () => ({}));

const mockConnect = jest.fn();
const mockRepository = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();

(DatabaseManager.connect as jest.Mock) = mockConnect;
(DatabaseManager.repository as jest.Mock) = mockRepository;

beforeEach(() => {
  jest.clearAllMocks();
  (fs.existsSync as jest.Mock).mockReset();
  (fs.createReadStream as jest.Mock).mockReset();
  (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
  mockRepository.mockResolvedValue({
    create: mockCreate,
    save: mockSave,
  });
});

describe('LoadExcelFile Integration', () => {
  it('logs error and returns if file does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await LoadExcelFile.execute();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('File not found'));
    logSpy.mockRestore();
  });

  it('processes valid CSV rows and saves movies', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Mock stream and CSV parser
    const onMock = jest.fn();
    const pipeMock = jest.fn().mockReturnValue({ on: onMock });
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe: pipeMock });

    // Simulate CSV parser events
    let dataHandler: any, endHandler: any;
    onMock.mockImplementation((event, handler) => {
      if (event === 'data') dataHandler = handler;
      if (event === 'end') endHandler = handler;
      return { on: onMock };
    });

    // Mock validation schema
    (excelMovieValidationSchema.validate as jest.Mock).mockImplementation((row) => ({
      error: null,
      value: row,
    }));

    // Simulate repository
    mockCreate.mockImplementation((movie) => movie);
    mockSave.mockResolvedValue(undefined);

    // Run execute
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await LoadExcelFile.execute();

    // Simulate CSV rows
    await dataHandler({
      year: '2000',
      title: 'Movie A',
      studios: 'Studio X',
      producers: 'Producer Y',
      winner: 'yes',
    });
    await dataHandler({
      year: '2001',
      title: 'Movie B',
      studios: 'Studio Y',
      producers: 'Producer Z',
      winner: 'no',
    });

    // Simulate end event
    await endHandler();

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockSave).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith('CSV file processing completed.');
    logSpy.mockRestore();
  });

  it('logs validation errors and does not save invalid rows', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const onMock = jest.fn();
    const pipeMock = jest.fn().mockReturnValue({ on: onMock });
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe: pipeMock });

    let dataHandler: any, endHandler: any;
    onMock.mockImplementation((event, handler) => {
      if (event === 'data') dataHandler = handler;
      if (event === 'end') endHandler = handler;
      return { on: onMock };
    });

    (excelMovieValidationSchema.validate as jest.Mock).mockImplementation(() => ({
      error: { message: 'Invalid data' },
      value: {},
    }));

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await LoadExcelFile.execute();

    await dataHandler({ year: 'bad', title: '', studios: '', producers: '', winner: '' });
    await endHandler();

    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid row'));
    logSpy.mockRestore();
  });

  it('logs error if CSV reading fails', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const onMock = jest.fn();
    const pipeMock = jest.fn().mockReturnValue({ on: onMock });
    (fs.createReadStream as jest.Mock).mockReturnValue({ pipe: pipeMock });

    let errorHandler: any;
    onMock.mockImplementation((event, handler) => {
      if (event === 'error') errorHandler = handler;
      return { on: onMock };
    });

    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await LoadExcelFile.execute();

    errorHandler(new Error('Stream error'));

    expect(logSpy).toHaveBeenCalledWith('Error reading CSV file:', expect.any(Error));
    logSpy.mockRestore();
  });
});
