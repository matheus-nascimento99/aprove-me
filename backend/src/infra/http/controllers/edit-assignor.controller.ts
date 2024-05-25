import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Param,
  Put,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'
import { EditAssignorUseCase } from '@/domain/assignors-payables-management/application/use-cases/edit-assignor'
import { AssignorWithSameDocumentAlreadyExistsError } from '@/domain/assignors-payables-management/application/use-cases/errors/assignor-with-same-document-already-exists'
import { AssignorWithSameEmailAlreadyExistsError } from '@/domain/assignors-payables-management/application/use-cases/errors/assignor-with-same-email-already-exists'
import { AssignorWithSamePhoneAlreadyExistsError } from '@/domain/assignors-payables-management/application/use-cases/errors/assignor-with-same-phone-already-exists'
import { capitalize } from '@/utils/capitalize'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const editAssignorSchema = z.object({
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
  document: z
    .string({ required_error: 'O campo documento é obrigatório.' })
    .min(1)
    .max(30, 'Este campo suporta somente 30 caracteres.'),
})

type EditAssignorSchema = z.infer<typeof editAssignorSchema>

@Controller('/integrations/assignor/:id')
export class EditAssignorController {
  constructor(private editAssignorUseCase: EditAssignorUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') assignorId: string,
    @Body(new ZodValidationPipe(editAssignorSchema)) body: EditAssignorSchema,
  ) {
    const result = await this.editAssignorUseCase.execute({
      ...body,
      assignorId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
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
