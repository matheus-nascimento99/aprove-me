import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { Raw } from '@/core/value-objects/raw'
import { FetchAssignorsUseCase } from '@/domain/assignors-payables-management/application/use-cases/fetch-assignors'
import { capitalize } from '@/utils/capitalize'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AssignorsPresenter } from '../presenters/assignor'

const fetchAssignorsQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  name: z
    .string()
    .max(140, 'Este campo suporta somente 140 caracteres.')
    .transform((value) => capitalize(value))
    .optional(),
  email: z
    .string()
    .max(140, 'Este campo suporta somente 140 caracteres.')
    .transform((value) => value.trim().toLowerCase())
    .optional(),
  phone: z
    .string()
    .max(20, 'Este campo suporta somente 20 caracteres.')
    .transform((value) => Raw.createFromText(value).value)
    .optional(),
  document: z
    .string()
    .max(30, 'Este campo suporta somente 30 caracteres.')
    .transform((value) => Raw.createFromText(value).value)
    .optional(),
})

type FetchAssignorsQuerySchema = z.infer<typeof fetchAssignorsQuerySchema>

@Controller('/integrations/assignor')
export class FetchAssignorsController {
  constructor(private fetchAssignorsUseCase: FetchAssignorsUseCase) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(fetchAssignorsQuerySchema))
    query: FetchAssignorsQuerySchema,
  ) {
    const result = await this.fetchAssignorsUseCase.execute({
      filterParams: {
        name: query.name,
        email: query.email,
        phone: query.phone,
        document: query.document,
      },
      paginationParams: { page: query.page, limit: query.limit },
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      items: result.value.items.map((item) => AssignorsPresenter.toHTTP(item)),
      total: result.value.total,
      prev: result.value.prev,
      next: result.value.next,
    }
  }
}
