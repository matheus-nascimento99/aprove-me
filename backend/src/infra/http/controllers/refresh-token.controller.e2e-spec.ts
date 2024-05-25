import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { DEFAULT_PASSWORD } from '@/utils/default-password'

describe('Refresh token (e2e)', () => {
  let app: INestApplication
  let assignorFactory: AssignorFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AssignorFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    assignorFactory = moduleRef.get(AssignorFactory)

    app.use(cookieParser())
    await app.init()
  })

  test('/integrations/refresh-token (PATCH)', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()

    const authenticate = await request(app.getHttpServer())
      .post('/integrations/auth')
      .send({
        login: assignor.email,
        password: DEFAULT_PASSWORD,
      })

    const cookies = authenticate.get('Set-Cookie') as string[]

    const refreshToken = await request(app.getHttpServer())
      .patch('/integrations/refresh-token')
      .set('Cookie', cookies)
      .send()

    expect(refreshToken.statusCode).toEqual(200)
    expect(refreshToken.body).toMatchObject({
      access_token: expect.any(String),
    })
    expect(authenticate.get('Set-Cookie')).toEqual(
      expect.arrayContaining([expect.stringContaining('refresh_token=')]),
    )
  })
})
