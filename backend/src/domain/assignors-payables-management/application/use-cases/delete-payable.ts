import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

import { PayablesRepository } from '../repositories/payables'

type DeletePayableUseCaseRequest = {
  payableId: string
}

type DeletePayableUseCaseResponse = Either<ResourceNotFoundError, unknown>
@Injectable()
export class DeletePayableUseCase {
  constructor(private payablesRepository: PayablesRepository) {}

  async execute({
    payableId,
  }: DeletePayableUseCaseRequest): Promise<DeletePayableUseCaseResponse> {
    const payable = await this.payablesRepository.findById(
      new UniqueEntityId(payableId),
    )

    if (!payable) {
      return left(new ResourceNotFoundError(payableId))
    }

    await this.payablesRepository.delete(payable.id)

    return right({})
  }
}
