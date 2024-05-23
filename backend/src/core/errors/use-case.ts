export class UseCaseError extends Error {
  constructor(public message: string) {
    super(message)
  }
}
