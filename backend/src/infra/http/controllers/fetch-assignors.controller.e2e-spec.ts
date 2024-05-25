import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'

import { AppModule } from '@/app.module'
import { Raw } from '@/core/value-objects/raw'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch assignors (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let assignorFactory: AssignorFactory

  const name = faker.person.fullName()
  const email = faker.internet.email()
  const phone = faker.phone.number()
  const document = faker.string.numeric(30)

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AssignorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    assignorFactory = moduleRef.get(AssignorFactory)

    await app.init()
  })

  test('/integrations/assignor (GET)', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    for (let index = 0; index < 10; index++) {
      await assignorFactory.makePrismaAssignor(
        index < 2
          ? {
              name: 'i' + name + index,
              email: 'i' + email + index,
              phone: Raw.createFromText('i' + phone + index),
              document: Raw.create('i' + document + index),
            }
          : {},
      )
    }

    const result = await request(app.getHttpServer())
      .get(`/integrations/assignor`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
  })

  test('/integrations/assignor (GET) [paginated]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const result = await request(app.getHttpServer())
      .get(`/integrations/assignor?page=2&limit=8`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
  })

  test('/integrations/assignor (GET) [filter=name]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const result = await request(app.getHttpServer())
      .get(
        `/integrations/assignor?page=1&limit=8&name=${'i' + name.substring(0, 3)}`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body.items).toHaveLength(2)
  })

  test('/integrations/assignor (GET) [filter=email]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const result = await request(app.getHttpServer())
      .get(
        `/integrations/assignor?page=1&limit=8&email=${'i' + email.substring(0, 3)}`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body.items).toHaveLength(2)
  })

  test('/integrations/assignor (GET) [filter=phone]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const result = await request(app.getHttpServer())
      .get(
        `/integrations/assignor?page=1&limit=8&phone=${'i' + phone.substring(0, 3)}`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body.items).toHaveLength(2)
  })

  test('/integrations/assignor (GET) [filter=document]', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const result = await request(app.getHttpServer())
      .get(
        `/integrations/assignor?page=1&limit=8&document=${'i' + document.substring(0, 3)}`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body.items).toHaveLength(2)
  })
})
