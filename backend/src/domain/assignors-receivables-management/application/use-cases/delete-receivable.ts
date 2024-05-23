import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { ReceivablesRepository } from '../repositories/receivables'

type DeleteReceivableUseCaseRequest = {
  receivableId: string
}

type DeleteReceivableUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class DeleteReceivableUseCase {
  constructor(private receivablesRepository: ReceivablesRepository) {}

  async execute({
    receivableId,
  }: DeleteReceivableUseCaseRequest): Promise<DeleteReceivableUseCaseResponse> {
    const receivable = await this.receivablesRepository.findById(
      new UniqueEntityId(receivableId),
    )

    if (!receivable) {
      return left(new ResourceNotFoundError(receivableId))
    }

    await this.receivablesRepository.delete(receivable.id)

    return right({})
  }
}
