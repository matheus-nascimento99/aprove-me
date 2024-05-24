import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create assignor (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('/integrations/assignor [POST]', async () => {
    const createAssignor = await request(app.getHttpServer())
      .post('/integrations/assignor')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: '+55 1199999-9999',
        document: '000.000.000-00',
      })

    const assignors = await prisma.user.findMany({})

    expect(createAssignor.statusCode).toEqual(201)
    expect(assignors).toHaveLength(1)
  })
})
