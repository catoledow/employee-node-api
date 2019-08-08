import {Get, Post, Route, Body, Path, SuccessResponse, Controller, Delete, Put } from 'tsoa';
import { EmployeeService } from '../services/employee.service';
import { IEmployeeRequest } from '../interfaces/employee-request.interface';
import { IEmployeeResponse } from '../interfaces/employee-response.interface';
import { Employee } from '../models/employee.model';
import { Role } from '../models/role.enum';
import { Inject } from 'typescript-ioc';
import { JokeService } from '../services/joke.service';
import { QuoteService } from '../services/quote.service';
import { ValidationError } from '../models/validation.error';
import * as HttpStatus from 'http-status-codes';

@Route('employees')
export class EmployeeController extends Controller {
  @Inject
  private employeeService: EmployeeService;

  @Inject
  private jokeService: JokeService;

  @Inject
  private quoteService: QuoteService;

  @SuccessResponse(HttpStatus.OK, 'OK')
  @Get('')
  public async getAll(): Promise<IEmployeeResponse[]> {
    return this.employeeService.getAll();
  }

  @SuccessResponse(HttpStatus.OK, 'OK')
  @Get('{id}')
  public async getById(@Path() id: string): Promise<IEmployeeResponse> {
    return this.employeeService.getById(id);
  }

  @SuccessResponse(HttpStatus.CREATED, 'Created')
  @Post()
  public async create(@Body() requestBody: IEmployeeRequest): Promise<IEmployeeResponse> {
    requestBody.role = this.validateRole(requestBody.role);
    this.validateHireDate(requestBody.hireDate);
    const employee = new Employee(requestBody);

    try {
      await Promise.all([this.randomlyAssignJokesOrQuotes(employee), this.randomlyAssignJokesOrQuotes(employee)]);
    } catch (e) {
      throw new Error('There was an error fetching jokes and quotes.');
    }

    const result = this.employeeService.insert(employee);
    this.setStatus(HttpStatus.CREATED);
    return Promise.resolve(result);
  }

  @SuccessResponse(HttpStatus.OK, 'OK')
  @Put('{id}')
  public async update(@Path() id: string, @Body() requestBody: IEmployeeRequest): Promise<IEmployeeResponse> {
    requestBody.role = this.validateRole(requestBody.role);
    this.validateHireDate(requestBody.hireDate);
    const employee = new Employee(requestBody);
    employee.id = id;

    this.employeeService.update(employee);
    return Promise.resolve(employee);
  }

  @SuccessResponse(HttpStatus.NO_CONTENT, 'No Content')
  @Delete('{id}')
  public async remove(@Path() id: string): Promise<{}> {
    this.employeeService.delete(id);
    return Promise.resolve({});
  }

  private validateRole(role: string): string {
    role = role.toUpperCase();
    if (Object.values(Role).includes(role)) {
      return role;
    }

    throw new ValidationError('Role must be CEO, VP, Manager or Lackey', HttpStatus.BAD_REQUEST);
  }

  private validateHireDate(dateString: string): void {
    const isValidDateFormat = dateString.match(/^\d{4}-\d{2}-\d{2}$/) != null;

    if (isValidDateFormat) {
      const receivedDate = new Date(dateString);

      if (receivedDate instanceof Date && isNaN(receivedDate.valueOf())) {
        throw new ValidationError('Invalid hireDate provided.', HttpStatus.BAD_REQUEST);
      }

      const now = new Date();
      const nowWithoutTimezone = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      if (receivedDate.getTime() >= nowWithoutTimezone.getTime()) {
        throw new ValidationError('Date must be in the past.', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new ValidationError('Invalid hireDate format (should be YYYY-MM-DD).', HttpStatus.BAD_REQUEST);
    }
  }

  private async randomlyAssignJokesOrQuotes(employee: Employee): Promise<void> {
    if (Math.round(Math.random()) === 1) {
      employee.favoriteQuotes.push(await this.quoteService.fetch());
    } else {
      employee.favoriteJokes.push(await this.jokeService.fetch());
    }
  }
}
