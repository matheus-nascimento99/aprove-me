import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { HashCreator } from 'src/core/hash/hash-creator'

import { Raw } from '@/core/value-objects/raw'

import { Assignor } from '../../enterprise/entities/assignor'
import { AssignorsRepository } from '../repositories/assignors'
import { AssignorWithSameDocumentAlreadyExistsError } from './errors/assignor-with-same-document-already-exists'
import { AssignorWithSameEmailAlreadyExistsError } from './errors/assignor-with-same-email-already-exists'
import { AssignorWithSamePhoneAlreadyExistsError } from './errors/assignor-with-same-phone-already-exists'

type CreateAssignorUseCaseRequest = {
  name: string
  email: string
  phone: string
  password: string
  document: string
}

type CreateAssignorUseCaseResponse = Either<
  | AssignorWithSameEmailAlreadyExistsError
  | AssignorWithSamePhoneAlreadyExistsError
  | AssignorWithSameDocumentAlreadyExistsError,
  unknown
>

@Injectable()
export class CreateAssignorUseCase {
  constructor(
    private assignorsRepository: AssignorsRepository,
    private hashCreator: HashCreator,
  ) {}

  async execute({
    name,
    email,
    phone,
    password,
    document,
  }: CreateAssignorUseCaseRequest): Promise<CreateAssignorUseCaseResponse> {
    const assignorByPhone = await this.assignorsRepository.findByPhone(phone)

    if (assignorByPhone) {
      return left(new AssignorWithSamePhoneAlreadyExistsError(phone))
    }

    const assignorByEmail = await this.assignorsRepository.findByEmail(email)

    if (assignorByEmail) {
      return left(new AssignorWithSameEmailAlreadyExistsError(email))
    }

    const assignorByDocument =
      await this.assignorsRepository.findByDocument(document)

    if (assignorByDocument) {
      return left(new AssignorWithSameDocumentAlreadyExistsError(document))
    }

    const passwordHashed = await this.hashCreator.hash(password)

    const assignor = Assignor.create({
      name,
      email,
      phone: Raw.createFromText(phone),
      password: passwordHashed,
      document: Raw.createFromText(document),
    })

    await this.assignorsRepository.create(assignor)

    return right({})
  }
}
