export interface IFetchable {
  fetch: () => Promise<string>;
}
