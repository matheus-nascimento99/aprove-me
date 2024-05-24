import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Payable } from '../../enterprise/entities/payable'
import { AssignorsRepository } from '../repositories/assignors'
import { PayablesRepository } from '../repositories/payables'

type CreatePayableUseCaseRequest = {
  assignor: string
  value: number
}

type CreatePayableUseCaseResponse = Either<ResourceNotFoundError, unknown>

@Injectable()
export class CreatePayableUseCase {
  constructor(
    private payablesRepository: PayablesRepository,
    private assignorsRepository: AssignorsRepository,
  ) {}

  async execute({
    assignor,
    value,
  }: CreatePayableUseCaseRequest): Promise<CreatePayableUseCaseResponse> {
    const assignorById = await this.assignorsRepository.findById(
      new UniqueEntityId(assignor),
    )

    if (!assignorById) {
      return left(new ResourceNotFoundError(assignor))
    }

    const payable = Payable.create({
      assignor: new UniqueEntityId(assignor),
      value,
    })

    await this.payablesRepository.create(payable)

    return right({})
  }
}
