// tslint:disable:no-commented-code
// tslint:disable:max-classes-per-file
import { Employee } from '../models/employee.model';
import { EmployeeController } from '../controllers/employee.controller';
import { ValidationError } from '../models/validation.error';

const carlos = new Employee({ firstName: 'Carlos', lastName: 'Toledo', hireDate: '2019-01-01', role: 'CEO'});
const jose = new Employee({ firstName: 'José', lastName: 'Toledo', hireDate: '2015-01-01', role: 'VP'});

class EmployeeServiceMock {
  public getAll(): Employee[] {
    return [carlos, jose];
  }

  public getById(id: string) {
    if (id === '1') {
      return carlos;
    } else {
      throw new ValidationError('', 404);
    }
  }

  public insert(em: Employee) {
    return em;
  }

  public update(em: Employee) {
    return em;
  }

  public delete(id: string) {
    return;
  }
}

class QuoteJokeMock {
  public fetch() {
    return Promise.resolve('Some joke or quote');
  }
}

describe('Employee Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll() should return a promise of employees from EmployeeService', async () => {
    const ctrl = new EmployeeController();
    (ctrl as any).employeeService = new EmployeeServiceMock();

    expect(await ctrl.getAll()).toEqual([carlos, jose]);
  });

  it('getById() should return a promise of one employee from EmployeeService', async () => {
    const ctrl = new EmployeeController();
    (ctrl as any).employeeService = new EmployeeServiceMock();

    expect(await ctrl.getById('1')).toEqual(carlos);
  });

  it('create() should call insert() from EmployeeService if data passes all validations', async () => {
    const ctrl = new EmployeeController();
    const mock = new EmployeeServiceMock();
    (ctrl as any).employeeService = mock;
    (ctrl as any).jokeService = new QuoteJokeMock();
    (ctrl as any).quoteService = new QuoteJokeMock();
    const spy = jest.spyOn(mock, 'insert');
    const res = await ctrl.create({firstName: 'José', lastName: 'Toledo', hireDate: '2015-01-01', role: 'VP'});

    expect(spy).toHaveBeenCalled();
    expect(res).toBeInstanceOf(Employee);
  });

  it('create() should call fetch() two times, from Joke or Quote services', async () => {
    const ctrl = new EmployeeController();
    const mock = new QuoteJokeMock();
    (ctrl as any).employeeService = new EmployeeServiceMock();
    (ctrl as any).jokeService = mock;
    (ctrl as any).quoteService = mock;
    const spy = jest.spyOn(mock, 'fetch');
    const res = await ctrl.create({firstName: 'José', lastName: 'Toledo', hireDate: '2015-01-01', role: 'VP'});

    expect(spy).toHaveBeenCalledTimes(2);
    expect(res).toBeInstanceOf(Employee);
  });

  it('create() should throw an exception if hireDate is invalid', async () => {
    const ctrl = new EmployeeController();
    (ctrl as any).employeeService = new EmployeeServiceMock();
    (ctrl as any).jokeService = new QuoteJokeMock();
    (ctrl as any).quoteService = new QuoteJokeMock();

    try {
      await ctrl.create({firstName: 'José', lastName: 'Toledo', hireDate: '2015-48-99', role: 'VP'});
    } catch (e) {
      expect(e.status).toEqual(400);
    }
  });

  it('create() should throw an exception if hireDate is not in the correct format', async () => {
    const ctrl = new EmployeeController();
    (ctrl as any).employeeService = new EmployeeServiceMock();
    (ctrl as any).jokeService = new QuoteJokeMock();
    (ctrl as any).quoteService = new QuoteJokeMock();

    try {
      await ctrl.create({firstName: 'José', lastName: 'Toledo', hireDate: '01-01-2010', role: 'VP'});
    } catch (e) {
      expect(e.status).toEqual(400);
    }
  });

  it('create() should throw an exception if hireDate is not in the past', async () => {
    const ctrl = new EmployeeController();
    (ctrl as any).employeeService = new EmployeeServiceMock();
    (ctrl as any).jokeService = new QuoteJokeMock();
    (ctrl as any).quoteService = new QuoteJokeMock();
    const now = new Date();
    try {
      await ctrl.create({firstName: 'José', lastName: 'Toledo', hireDate: now.toISOString().split('T')[0], role: 'VP'});
    } catch (e) {
      expect(e.status).toEqual(400);
    }
  });

  it('create() should throw an exception if role is not a valid role', async () => {
    const ctrl = new EmployeeController();
    (ctrl as any).employeeService = new EmployeeServiceMock();
    (ctrl as any).jokeService = new QuoteJokeMock();
    (ctrl as any).quoteService = new QuoteJokeMock();
    const now = new Date();
    try {
      await ctrl.create({firstName: 'José', lastName: 'Toledo', hireDate: '2010-01-01', role: 'invalid'});
    } catch (e) {
      expect(e.status).toEqual(400);
    }
  });

  it('create() should throw an exception if joke/quote service fails to fetch data', async () => {
    const ctrl = new EmployeeController();
    const mock = new QuoteJokeMock();
    (ctrl as any).employeeService = new EmployeeServiceMock();
    (ctrl as any).jokeService = mock;
    (ctrl as any).quoteService = mock;
    const spy = jest.spyOn(mock, 'fetch').mockRejectedValue(0);

    try {
      const res = await ctrl.create({firstName: 'José', lastName: 'Toledo', hireDate: '2015-01-01', role: 'VP'});
    } catch (e) {
      expect(spy).toHaveBeenCalledTimes(2);
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('update() should call update() from EmployeeService if data passes all validations', async () => {
    const ctrl = new EmployeeController();
    const mock = new EmployeeServiceMock();
    (ctrl as any).employeeService = mock;
    const spy = jest.spyOn(mock, 'update');
    const res = await ctrl.update('1', {firstName: 'José', lastName: 'Toledo', hireDate: '2015-01-01', role: 'VP'});

    expect(spy).toHaveBeenCalled();
    expect(res).toBeInstanceOf(Employee);
  });

  it('remove() should call delete() from EmployeeService', async () => {
    const ctrl = new EmployeeController();
    const mock = new EmployeeServiceMock();
    (ctrl as any).employeeService = mock;
    const spy = jest.spyOn(mock, 'delete');
    const res = await ctrl.remove('1');

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual({});
  });
});
