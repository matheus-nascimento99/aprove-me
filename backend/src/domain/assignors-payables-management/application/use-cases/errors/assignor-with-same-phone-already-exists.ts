import { UseCaseError } from 'src/core/errors/use-case'

export class AssignorWithSamePhoneAlreadyExistsError extends UseCaseError {
  constructor(public phone: string) {
    super(`Assignor with phone "${phone}" already exists.`)
  }
}
