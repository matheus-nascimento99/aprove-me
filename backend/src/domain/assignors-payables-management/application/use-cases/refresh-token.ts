import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'

import { UserPayload } from '@/auth/jwt.strategy'
import { Cryptographer } from '@/core/cryptography/cryptographer'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { AssignorsRepository } from '../repositories/assignors'

type RefreshTokenUseCaseRequest = {
  user: UserPayload
}

type RefreshTokenUseCaseResponse = Either<
  ResourceNotFoundError,
  { token: string; refreshToken: string }
>
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private assignorsRepository: AssignorsRepository,
    private cryptographer: Cryptographer,
  ) {}

  async execute({
    user,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const assignor = await this.assignorsRepository.findById(
      new UniqueEntityId(user.sub),
    )

    if (!assignor) {
      return left(new ResourceNotFoundError(user.sub))
    }

    const token = await this.cryptographer.encrypt({ sub: user.sub.toString() })

    const refreshToken = await this.cryptographer.encrypt(
      {
        sub: user.sub.toString(),
      },
      '10m',
    )

    return right({ token, refreshToken })
  }
}
