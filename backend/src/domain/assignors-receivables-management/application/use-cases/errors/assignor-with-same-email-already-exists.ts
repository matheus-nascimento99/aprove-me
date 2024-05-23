import { UseCaseError } from 'src/core/errors/use-case'

export class AssignorWithSameEmailAlreadyExistsError extends UseCaseError {
  constructor(public email: string) {
    super(`Assignor with email "${email}" already exists.`)
  }
}
