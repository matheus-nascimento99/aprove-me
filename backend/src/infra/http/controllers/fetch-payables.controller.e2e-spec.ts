import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'
import { PayableFactory } from 'test/factories/make-payable'

import { AppModule } from '@/app.module'
import { Assignor } from '@/domain/assignors-payables-management/enterprise/entities/assignor'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch payables (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let payableFactory: PayableFactory
  let assignorFactory: AssignorFactory
  let assignor: Assignor

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PayableFactory, AssignorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    payableFactory = moduleRef.get(PayableFactory)
    assignorFactory = moduleRef.get(AssignorFactory)

    assignor = await assignorFactory.makePrismaAssignor()

    await app.init()
  })

  test('/integrations/payable (GET)', async () => {
    const token = jwt.sign({ sub: assignor.id.toString() })

    for (let index = 0; index < 10; index++) {
      await payableFactory.makePrismaPayable({ assignor: assignor.id })
    }

    const result = await request(app.getHttpServer())
      .get(`/integrations/payable`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
  })

  test('/integrations/payable (GET) [paginated]', async () => {
    const token = jwt.sign({ sub: assignor.id.toString() })

    const result = await request(app.getHttpServer())
      .get(`/integrations/payable?page=2&limit=8`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body.items).toHaveLength(2)
  })
})
