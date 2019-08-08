import mockAxios from 'axios';
import { QuoteService } from './quote.service';

describe('Quote Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetch() should return a promise with a string if service works successfully', async () => {
    jest.spyOn(mockAxios, 'get').mockImplementation(() => {
      return Promise.resolve({
        data: ['Something smart.']
      });
    });

    const serv = new QuoteService();
    expect(await serv.fetch()).toEqual('Something smart.');
  });
});
