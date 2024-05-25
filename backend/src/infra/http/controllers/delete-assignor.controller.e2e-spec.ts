import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete assignor (e2e)', () => {
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

  test('/:order_id (DELETE)', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const result = await request(app.getHttpServer())
      .delete(`/integrations/assignor/${assignor.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    const assignorDeleted = await prisma.user.findUnique({
      where: {
        id: assignor.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(assignorDeleted).toBeNull()
  })
})
