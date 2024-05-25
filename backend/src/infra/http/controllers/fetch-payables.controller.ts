import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { CurrentUser } from '@/auth/current-user'
import { UserPayload } from '@/auth/jwt.strategy'
import { FetchPayablesUseCase } from '@/domain/assignors-payables-management/application/use-cases/fetch-payables'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PayablesPresenter } from '../presenters/payable'

const fetchPayablesQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})

type FetchPayablesQuerySchema = z.infer<typeof fetchPayablesQuerySchema>

@Controller('/integrations/payable')
export class FetchPayablesController {
  constructor(private fetchPayablesUseCase: FetchPayablesUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchPayablesQuerySchema))
    query: FetchPayablesQuerySchema,
  ) {
    const result = await this.fetchPayablesUseCase.execute({
      assignorId: user.sub,
      filterParams: {},
      paginationParams: { page: query.page, limit: query.limit },
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      items: result.value.items.map((item) => PayablesPresenter.toHTTP(item)),
      total: result.value.total,
      prev: result.value.prev,
      next: result.value.next,
    }
  }
}
