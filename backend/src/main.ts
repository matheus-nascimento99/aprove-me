import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { Env } from './infra/env/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const env = app.get<ConfigService<Env, true>>(ConfigService)
  const port = env.get('PORT', { infer: true })

  app.use(cookieParser())

  await app.listen(port)
}
bootstrap()
