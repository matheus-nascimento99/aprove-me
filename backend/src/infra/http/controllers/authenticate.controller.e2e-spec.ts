import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DEFAULT_PASSWORD } from '@/utils/default-password'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let assignorFactory: AssignorFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AssignorFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    assignorFactory = moduleRef.get(AssignorFactory)

    await app.init()
  })

  test('/integrations/auth (POST) [EMAIL]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()

    const authenticate = await request(app.getHttpServer())
      .post('/integrations/auth')
      .send({
        login: assignor.email,
        password: DEFAULT_PASSWORD,
      })

    expect(authenticate.statusCode).toEqual(201)
    expect(authenticate.body).toMatchObject({
      access_token: expect.any(String),
    })
    expect(authenticate.get('Set-Cookie')).toEqual(
      expect.arrayContaining([expect.stringContaining('refresh_token=')]),
    )
  })

  test('/integrations/auth (POST) [DOCUMENT]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()

    const authenticate = await request(app.getHttpServer())
      .post('/integrations/auth')
      .send({
        login: assignor.document.value,
        password: DEFAULT_PASSWORD,
      })

    expect(authenticate.statusCode).toEqual(201)
    expect(authenticate.body).toMatchObject({
      access_token: expect.any(String),
    })
    expect(authenticate.get('Set-Cookie')).toEqual(
      expect.arrayContaining([expect.stringContaining('refresh_token=')]),
    )
  })
})
