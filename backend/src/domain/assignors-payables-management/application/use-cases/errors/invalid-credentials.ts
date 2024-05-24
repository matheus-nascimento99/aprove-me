import { UseCaseError } from '@/core/errors/use-case'

export class InvalidCredentialsError extends UseCaseError {
  constructor() {
    super('Invalid user/password credentials.')
  }
}
