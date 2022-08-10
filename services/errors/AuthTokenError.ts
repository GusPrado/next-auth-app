export class AuthTokenError extends Error {
  constructor() {
    super('Error on authentication token.');
  }
}
