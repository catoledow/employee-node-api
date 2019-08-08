import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';

describe('Employee Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const carlos = new Employee({ firstName: 'Carlos', lastName: 'Toledo', hireDate: '2019-01-01', role: 'CEO'});
  const jose = new Employee({ firstName: 'José', lastName: 'Toledo', hireDate: '2015-01-01', role: 'VP'});

  it('getAll() should return empty array if there are no employees', async () => {
    const serv = new EmployeeService();
    expect(serv.getAll()).toEqual([]);
  });

  it('getAll() should return array of employees', async () => {
    const serv = new EmployeeService();

    // bypassing private property
    (serv as any).employees.set('1', carlos);
    (serv as any).employees.set('2', jose);

    expect(serv.getAll()).toEqual([carlos, jose]);
  });

  it('getById() should return the employee matching the id only, if he exists', async () => {
    const serv = new EmployeeService();

    // bypassing private property
    (serv as any).employees.set('1', carlos);
    (serv as any).employees.set('2', jose);

    expect(serv.getById('2')).toEqual(jose);
  });

  it('getById() should throw an exception if the employee does not exist', async () => {
    const serv = new EmployeeService();

    try {
      // no employees there
      serv.getById('2');
    } catch (e) {
      expect(e.status).toEqual(404);
    }
  });

  it('insert() should insert a new employee to the list', async () => {
    const serv = new EmployeeService();

    serv.insert(carlos);
    expect(serv.getAll()).toEqual([carlos]);
  });

  it('insert() should throw an exception if the new employee is CEO and another CEO already exists', async () => {
    const serv = new EmployeeService();

    (serv as any).employees.set('1', carlos);
    try {
      serv.insert(carlos);
    } catch (e) {
      expect(e.status).toEqual(422);
    }
  });

  it('update() should update an existing employee in the list', async () => {
    const serv = new EmployeeService();
    const oldCarlos = new Employee({ id: '1', firstName: 'Carlos', lastName: 'Toledo', hireDate: '2017-01-01', role: 'CEO'});
    (serv as any).employees.set('1', oldCarlos);
    const newCarlos = new Employee({ id: '1', firstName: 'Carlos', lastName: 'Toledo', hireDate: '2019-01-01', role: 'CEO'});
    serv.update(newCarlos);
    expect(serv.getById('1')).toEqual(newCarlos);
  });

  it('delete() should remove an existing employee from the list', async () => {
    const serv = new EmployeeService();

    (serv as any).employees.set('1', carlos);
    serv.delete('1');
    expect(serv.getAll()).toEqual([]);
  });

  it('delete() should throw an exception if the employee to be deleted does not exist in the list', async () => {
    const serv = new EmployeeService();

    try {
      serv.delete('1'); // does not exist
    } catch (e) {
      expect(e.status).toEqual(404);
    }
  });
});
