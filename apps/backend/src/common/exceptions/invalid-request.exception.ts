export default class InvalidRequestException extends Error {
  public override message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
