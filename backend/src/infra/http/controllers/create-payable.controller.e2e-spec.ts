import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create payable (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let assignorFactory: AssignorFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AssignorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    assignorFactory = moduleRef.get(AssignorFactory)

    await app.init()
  })

  test('/integrations/payable [POST]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const createPayable = await request(app.getHttpServer())
      .post('/integrations/payable')
      .set('Authorization', `Bearer ${token}`)
      .send({
        assignor: assignor.id.toString(),
        value: '10000',
      })

    const payables = await prisma.payable.findMany({})

    expect(createPayable.statusCode).toEqual(201)
    expect(payables).toHaveLength(1)
  })
})
