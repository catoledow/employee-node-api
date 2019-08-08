import axios, { AxiosResponse } from 'axios';
import { Singleton } from 'typescript-ioc';
import { IFetchable } from '../interfaces/fetchable.interface';

@Singleton
export class QuoteService implements IFetchable {
  private readonly url = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';

  public async fetch(): Promise<string> {
    const response: AxiosResponse<string[]> = await axios.get<string[]>(this.url);

    if (response.data instanceof Array && response.data.length > 0) {
      return response.data[0];
    }
  }
}
