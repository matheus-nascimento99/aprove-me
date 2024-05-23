import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { Raw } from '@/core/value-objects/raw'

import { AssignorsRepository } from '../repositories/assignors'
import { AssignorWithSameDocumentAlreadyExistsError } from './errors/assignor-with-same-document-already-exists'
import { AssignorWithSameEmailAlreadyExistsError } from './errors/assignor-with-same-email-already-exists'
import { AssignorWithSamePhoneAlreadyExistsError } from './errors/assignor-with-same-phone-already-exists'

type EditAssignorUseCaseRequest = {
  assignorId: string
  name: string
  email: string
  phone: string
  document: string
}

type EditAssignorUseCaseResponse = Either<
  | ResourceNotFoundError
  | AssignorWithSameEmailAlreadyExistsError
  | AssignorWithSamePhoneAlreadyExistsError
  | AssignorWithSameDocumentAlreadyExistsError,
  unknown
>

export class EditAssignorUseCase {
  constructor(private assignorsRepository: AssignorsRepository) {}

  async execute({
    assignorId,
    name,
    email,
    phone,
    document,
  }: EditAssignorUseCaseRequest): Promise<EditAssignorUseCaseResponse> {
    const assignor = await this.assignorsRepository.findById(
      new UniqueEntityId(assignorId),
    )

    if (!assignor) {
      return left(new ResourceNotFoundError(assignorId))
    }

    const assignorByEmail = await this.assignorsRepository.findByEmail(email)

    const isAssignorWithSameEmailExistsAndIsNotSameThatIsBeingEditing =
      assignorByEmail && !assignorByEmail.id.equals(assignor.id)

    if (isAssignorWithSameEmailExistsAndIsNotSameThatIsBeingEditing) {
      return left(new AssignorWithSameEmailAlreadyExistsError(email))
    }

    const assignorByPhone = await this.assignorsRepository.findByPhone(phone)

    const isAssignorWithSamePhoneExistsAndIsNotSameThatIsBeingEditing =
      assignorByPhone && !assignorByPhone.id.equals(assignor.id)

    if (isAssignorWithSamePhoneExistsAndIsNotSameThatIsBeingEditing) {
      return left(new AssignorWithSamePhoneAlreadyExistsError(phone))
    }

    const assignorByDocument =
      await this.assignorsRepository.findByDocument(document)

    const isAssignorWithSameDocumentExistsAndIsNotSameThatIsBeingEditing =
      assignorByDocument && !assignorByDocument.id.equals(assignor.id)

    if (isAssignorWithSameDocumentExistsAndIsNotSameThatIsBeingEditing) {
      return left(new AssignorWithSameDocumentAlreadyExistsError(document))
    }

    assignor.name = name
    assignor.email = email
    assignor.phone = Raw.createFromText(phone)
    assignor.document = Raw.createFromText(document)

    await this.assignorsRepository.save(assignor.id, assignor)

    return right({})
  }
}
