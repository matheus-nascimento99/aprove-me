import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'
import { PayableFactory } from 'test/factories/make-payable'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete payable (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let assignorFactory: AssignorFactory
  let payableFactory: PayableFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PayableFactory, AssignorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    assignorFactory = moduleRef.get(AssignorFactory)
    payableFactory = moduleRef.get(PayableFactory)

    await app.init()
  })

  test('/integrations/assignor/:id (DELETE)', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const payable = await payableFactory.makePrismaPayable({
      assignor: assignor.id,
    })

    const result = await request(app.getHttpServer())
      .delete(`/integrations/payable/${payable.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    const payableDeleted = await prisma.payable.findUnique({
      where: {
        id: payable.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(payableDeleted).toBeNull()
  })
})
