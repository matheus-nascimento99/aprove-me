import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { User as PrismaAssignor } from '@prisma/client'
import request from 'supertest'
import { AssignorFactory } from 'test/factories/make-assignor'

import { AppModule } from '@/app.module'
import { Raw } from '@/core/value-objects/raw'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { capitalize } from '@/utils/capitalize'

describe('Edit assignor (e2e)', () => {
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

  test('/integrations/assignor/:id (PUT)', async () => {
    const assignor = await assignorFactory.makePrismaAssignor()
    const token = jwt.sign({ sub: assignor.id.toString() })

    const newAssignor = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: '+55 1199999-9999',
      document: '000.000.000-00',
    }

    const result = await request(app.getHttpServer())
      .put(`/integrations/assignor/${assignor.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newAssignor)

    const assignorEdited = await prisma.user.findUnique({
      where: { id: assignor.id.toString() },
    })

    expect(result.statusCode).toEqual(204)
    expect(assignorEdited).not.toBeNull()
    expect((assignorEdited as PrismaAssignor).name).toEqual(
      capitalize(newAssignor.name),
    )
    expect((assignorEdited as PrismaAssignor).email).toEqual(
      newAssignor.email.toLowerCase(),
    )
    expect((assignorEdited as PrismaAssignor).phone).toEqual(
      Raw.createFromText(newAssignor.phone).value,
    )
    expect((assignorEdited as PrismaAssignor).document).toEqual(
      Raw.createFromText(newAssignor.document).value,
    )
  })
})
