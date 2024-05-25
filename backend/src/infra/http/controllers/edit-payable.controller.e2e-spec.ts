import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { Payable as PrismaPayable } from '@prisma/client'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'
import { PayableFactory } from 'test/factories/make-payable'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit payable (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let payableFactory: PayableFactory
  let assignorFactory: AssignorFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AssignorFactory, PayableFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    payableFactory = moduleRef.get(PayableFactory)
    assignorFactory = moduleRef.get(AssignorFactory)

    await app.init()
  })

  test('/integrations/payable/:id (PUT)', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const payable = await payableFactory.makePrismaPayable({
      assignor: assignor.id,
    })

    const newPayable = {
      assignor: assignor.id.toString(),
      value: faker.number.float(),
    }

    const result = await request(app.getHttpServer())
      .put(`/integrations/payable/${payable.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newPayable)

    const payableEdited = await prisma.payable.findUnique({
      where: { id: payable.id.toString() },
    })

    expect(result.statusCode).toEqual(204)
    expect(payableEdited).not.toBeNull()
    expect((payableEdited as PrismaPayable).value).toEqual(newPayable.value)
  })
})
