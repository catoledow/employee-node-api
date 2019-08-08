import { Employee } from '../models/employee.model';
import uuid from 'uuid/v4';
import { Singleton } from 'typescript-ioc';
import { Role } from '../models/role.enum';
import { ValidationError } from '../models/validation.error';
import * as HttpStatus from 'http-status-codes';

@Singleton
export class EmployeeService {

  private employees: Map<string, Employee> = new Map<string, Employee>();

  public getAll(): Employee[] {
    return Array.of(...this.employees.values());
  }

  public getById(id: string): Employee {
    if (this.checkExists(id)) {
      return this.employees.get(id);
    }
  }

  public insert(employee: Employee): Employee {
    if (this.validateCEO(employee.role)) {
      employee.id = uuid();
      this.employees.set(employee.id , employee);

      return employee;
    }
  }

  public update(employee: Employee): Employee {
    if (this.checkExists(employee.id) && this.validateCEO(employee.role, employee.id)) {
      const oldEmployee = this.employees.get(employee.id);
      employee.favoriteJokes = oldEmployee.favoriteJokes;
      employee.favoriteQuotes = oldEmployee.favoriteQuotes;

      this.employees.set(employee.id, employee);
      return employee;
    }
  }

  public delete(id: string): boolean {
    if (this.checkExists(id)) {
      return this.employees.delete(id);
    }
  }

  private checkExists(id: string): boolean {
    if (this.employees.has(id)) {
      return true;
    }

    throw new ValidationError('Employee not found.', HttpStatus.NOT_FOUND);
  }

  private validateCEO(role: Role, oldId?: string): boolean {
    if (role === Role.CEO && this.hasCEO(oldId)) {
      throw new ValidationError('Sorry, we cant have two CEOs here.', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return true;
  }

  private hasCEO(oldId?: string): boolean {
    return this.getAll().some((emp) => emp.isCEO() && emp.id !== oldId);
  }
}
