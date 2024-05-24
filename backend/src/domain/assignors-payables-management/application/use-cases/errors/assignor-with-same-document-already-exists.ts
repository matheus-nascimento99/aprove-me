import { UseCaseError } from 'src/core/errors/use-case'

export class AssignorWithSameDocumentAlreadyExistsError extends UseCaseError {
  constructor(public document: string) {
    super(`Assignor with document "${document}" already exists.`)
  }
}
