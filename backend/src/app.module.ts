import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { envSchema } from './infra/env/env'
import { EnvModule } from './infra/env/env.module'
import { HttpModule } from './infra/http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (obj) => envSchema.parse(obj),
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
