export interface IEmployeeResponse {
  id: string;
  firstName: string;
  lastName: string;
  hireDate: string | Date;
  role: string;
  favoriteJokes: string[];
  favoriteQuotes: string[];
}
