import WinnersIntervalService from './WinnersIntervalService';
import DatabaseManager from '../../../infra/database/DatabaseManager';

jest.mock('../../../infra/database/DatabaseManager');

const mockConnect = jest.fn();
const mockRepository = jest.fn();
const mockFind = jest.fn();

(DatabaseManager.connect as jest.Mock) = mockConnect;
(DatabaseManager.repository as jest.Mock) = mockRepository;

beforeEach(() => {
  jest.clearAllMocks();
  mockRepository.mockResolvedValue({ find: mockFind });
});

describe('WinnersIntervalService Integration', () => {
  it('returns empty min and max when there are no winners', async () => {
    mockFind.mockResolvedValue([]);
    const result = await WinnersIntervalService.execute();
    expect(result).toEqual({ min: [], max: [] });
  });

  it('calculates intervals for a single producer with multiple wins', async () => {
    mockFind.mockResolvedValue([
      { producers: 'John Doe', year: 2000 },
      { producers: 'John Doe', year: 2005 },
      { producers: 'John Doe', year: 2010 },
    ]);
    const result = await WinnersIntervalService.execute();
    expect(result.min[0].producer).toBe('John Doe');
    expect(result.max[0].producer).toBe('John Doe');
    expect(result.min[0].interval).toBe(5);
    expect(result.max[0].interval).toBe(5);
    expect(result.min.length).toBe(2);
    expect(result.max.length).toBe(2);
  });

  it('handles multiple producers and splitting logic', async () => {
    mockFind.mockResolvedValue([
      { producers: 'Alice, Bob', year: 2000 },
      { producers: 'Alice and Charlie', year: 2002 },
      { producers: 'Bob', year: 2005 },
      { producers: 'Alice', year: 2010 },
    ]);
    const result = await WinnersIntervalService.execute();
    // Alice: 2000, 2002, 2010 -> intervals: 2, 8
    // Bob: 2000, 2005 -> interval: 5
    // Charlie: 2002 -> only one win
    expect(result.min.some((i) => i.producer === 'Alice' && i.interval === 2)).toBe(true);
    expect(result.max.some((i) => i.producer === 'Alice' && i.interval === 8)).toBe(true);
    expect(result.min.some((i) => i.producer === 'Bob' && i.interval === 5)).toBe(false); // 2 is min
    expect(result.max.some((i) => i.producer === 'Bob' && i.interval === 5)).toBe(false); // 8 is max
  });

  it('ignores producers with only one win', async () => {
    mockFind.mockResolvedValue([
      { producers: 'Solo Producer', year: 2001 },
      { producers: 'Duo, Solo Producer', year: 2005 },
      { producers: 'Duo', year: 2010 },
    ]);
    const result = await WinnersIntervalService.execute();
    // Solo Producer: 2001, 2005 -> interval: 4
    // Duo: 2005, 2010 -> interval: 5
    expect(result.min.length).toBe(1);
    expect(result.max.length).toBe(1);
    expect(result.min[0].interval).toBe(4);
    expect(result.max[0].interval).toBe(5);
    expect(result.min[0].producer).toBe('Solo Producer');
    expect(result.max[0].producer).toBe('Duo');
  });
});
