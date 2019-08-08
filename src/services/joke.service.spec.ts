import { JokeService } from './joke.service';
import mockAxios from 'axios';

describe('Joke Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetch() should return a promise with a string if service works successfully', async () => {
    jest.spyOn(mockAxios, 'get').mockImplementation(() => {
      return Promise.resolve({
        data: {
          joke: 'Something funny.'
        }
      });
    });

    const serv = new JokeService();
    expect(await serv.fetch()).toEqual('Something funny.');
  });
});
