import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { AssignorsRepository } from '../repositories/assignors'
import { ReceivablesRepository } from '../repositories/receivables'

type EditReceivableUseCaseRequest = {
  receivableId: string
  assignor: string
  value: number
}

type EditReceivableUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class EditReceivableUseCase {
  constructor(
    private receivablesRepository: ReceivablesRepository,
    private assignorsRepository: AssignorsRepository,
  ) {}

  async execute({
    receivableId,
    assignor,
    value,
  }: EditReceivableUseCaseRequest): Promise<EditReceivableUseCaseResponse> {
    const receivable = await this.receivablesRepository.findById(
      new UniqueEntityId(receivableId),
    )

    if (!receivable) {
      return left(new ResourceNotFoundError(receivableId))
    }

    const assignorById = await this.assignorsRepository.findById(
      new UniqueEntityId(assignor),
    )

    if (!assignorById) {
      return left(new ResourceNotFoundError(assignor))
    }

    receivable.assignor = new UniqueEntityId(assignor)
    receivable.value = value

    await this.receivablesRepository.save(receivable.id, receivable)

    return right({})
  }
}
