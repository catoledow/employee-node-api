import axios, { AxiosResponse } from 'axios';
import { Singleton } from 'typescript-ioc';
import { IJokeResponse } from '../interfaces/joke-response.interface';
import { IFetchable } from '../interfaces/fetchable.interface';

@Singleton
export class JokeService implements IFetchable {
  private readonly url = 'https://icanhazdadjoke.com/';

  public async fetch(): Promise<string> {
    const response: AxiosResponse<IJokeResponse> = await axios.get<IJokeResponse>(this.url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.data && typeof response.data.joke === 'string') {
      return response.data.joke;
    }
  }
}
