import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'

import { Cryptographer } from '@/core/cryptography/cryptographer'
import { HashComparer } from '@/core/hash/hash-comparer'

import { User, UserProps } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users'
import { InvalidCredentialsError } from './errors/invalid-credentials'

type AuthenticateUseCaseRequest = {
  login: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  InvalidCredentialsError,
  { user: User<UserProps>; token: string; refreshToken: string }
>
@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private cryptographer: Cryptographer,
  ) {}

  async execute({
    login,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByLogin(login)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordsEquals = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordsEquals) {
      return left(new InvalidCredentialsError())
    }

    const { password: undefided, ...rest } = user // eslint-disable-line

    const token = await this.cryptographer.encrypt({ sub: user.id.toString() })

    const refreshToken = await this.cryptographer.encrypt(
      {
        sub: user.id.toString(),
      },
      '10m',
    )

    return right({ user, token, refreshToken })
  }
}
