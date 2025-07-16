import { describe, it, expect } from 'vitest';
import { getRoomCountsFromStrs } from '../src/lib';

describe('getRoomCountsFromStrs', () => {
  it('parses a list of room number strings and returns the correct room counts', () => {

    const roomNumStrs: string[] = [
      "108", "115-A - 9", "115-A - 11", "208", "210 - 2 - FEMALE", "210 - 4 - FEMALE", "210 - 5 - FEMALE", "216 - 1", "216 - 2", "216 - 3", "216 - 4", "216 - 5", "216 - 6", "240-A- 3", "240-A- 4", "240-A- 5", "240-A- 6", "240-A- 7", "240-A- 9", "240-A- 10", "240-A- 11", "240-A- 12", "245-A- 9", "245-A- 10", "245-A- 11", "255-A - 1", "255-A - 2", "255-A - 3", "255-A - 4", "255-A - 5", "255-A - 6", "255-A - 7", "255-A - 8", "255-A - 9", "255-A - 10", "255-A - 11", "315", "316 - 2", "316 - 4", "316 - 5", "420-A - 3 - FEMALE", "420-A - 6 - FEMALE", "420-A - 8 - FEMALE", "420-A - 10 - FEMALE", "445", "455-A - 1 - FEMALE", "455-A - 2 - FEMALE", "455-A - 3 - FEMALE", "455-A - 4 - FEMALE", "455-A - 6 - FEMALE", "475", "480", "495-A - 2 - FEMALE"
    ];
    

    // TODO: Fill expectedValue with the correct key-value pairs
      const expectedValue: Map<number, number> = new Map()
          .set(108, 1  )
          .set(115, 2  )
          .set(208, 1  )
          .set(210, 3  )
          .set(216, 6  )
          .set(240, 9  )
          .set(245, 3  )
          .set(255, 11 )
          .set(315, 1  )
          .set(316, 3  )
          .set(420, 4  )
          .set(445, 1  )
          .set(455, 5  )
          .set(475, 1  )
          .set(480, 1  )
          .set(495, 1  ); 
      

    const res = getRoomCountsFromStrs(roomNumStrs);
    expect(res).toEqual(expectedValue);
  });
});