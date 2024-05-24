import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { Public } from '@/auth/public'
import { CreateAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/create-assignor'
import { AssignorWithSameDocumentAlreadyExistsError } from '@/domain/assignors-payables-management/application/use-cases/errors/assignor-with-same-document-already-exists'
import { AssignorWithSameEmailAlreadyExistsError } from '@/domain/assignors-payables-management/application/use-cases/errors/assignor-with-same-email-already-exists'
import { AssignorWithSamePhoneAlreadyExistsError } from '@/domain/assignors-payables-management/application/use-cases/errors/assignor-with-same-phone-already-exists'
import { capitalize } from '@/utils/capitalize'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createAssignorSchema = z.object({
  name: z
    .string({ required_error: 'O campo nome é obrigatório.' })
    .min(1)
    .max(140, 'Este campo suporta somente 140 caracteres.')
    .transform((value) => capitalize(value)),
  email: z
    .string({ required_error: 'O campo email é obrigatório.' })
    .min(1)
    .max(140, 'Este campo suporta somente 140 caracteres.')
    .transform((value) => value.trim().toLowerCase()),
  phone: z
    .string({ required_error: 'O campo telefone é obrigatório.' })
    .min(1)
    .max(20, 'Este campo suporta somente 20 caracteres.'),
  password: z.string({ required_error: 'O campo senha é obrigatório.' }).min(1),
  document: z
    .string({ required_error: 'O campo documento é obrigatório.' })
    .min(1)
    .max(30, 'Este campo suporta somente 30 caracteres.'),
})

type CreateAssignorSchema = z.infer<typeof createAssignorSchema>

@Controller('/integrations/assignor')
export class CreateAssignorController {
  constructor(private createAssignorUseCase: CreateAssignorUseCase) {}

  @Post()
  @HttpCode(201)
  @Public()
  async handle(
    @Body(new ZodValidationPipe(createAssignorSchema))
    body: CreateAssignorSchema,
  ) {
    const result = await this.createAssignorUseCase.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AssignorWithSameEmailAlreadyExistsError:
          throw new BadRequestException(error.message)
        case AssignorWithSamePhoneAlreadyExistsError:
          throw new BadRequestException(error.message)
        case AssignorWithSameDocumentAlreadyExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}
