export class ValidationError extends Error {
  public status: number;
  public fields: any;

  constructor(message: string, status: number, fields?: any) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.fields = fields;
  }
}
