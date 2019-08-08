import { IEmployeeResponse } from '../interfaces/employee-response.interface';
import { Role } from './role.enum';

export class Employee {
  public id: string;
  public firstName: string;
  public lastName: string;
  public hireDate: Date;
  public role: Role;
  public favoriteJokes: string[];
  public favoriteQuotes: string[];

  public constructor(empData?: Partial<IEmployeeResponse>) {
    this.id = empData.id;
    this.firstName = empData.firstName;
    this.lastName = empData.lastName;
    this.role = empData.role.toUpperCase() as Role;
    this.favoriteJokes = empData.favoriteJokes || new Array<string>();
    this.favoriteQuotes = empData.favoriteQuotes || new Array<string>();

    this.hireDate = new Date(empData.hireDate);
  }

  public isCEO() {
    return this.role === Role.CEO;
  }

  public toJSON(): IEmployeeResponse {
    // tslint:disable:object-literal-sort-keys
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      hireDate: this.hireDate.toISOString().split('T')[0],
      favoriteJokes: this.favoriteJokes,
      favoriteQuotes: this.favoriteQuotes
    };
  }
}
