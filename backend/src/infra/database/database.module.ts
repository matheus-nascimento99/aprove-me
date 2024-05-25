import { Module } from '@nestjs/common'

import { AssignorsRepository } from '@/domain/assignors-payables-management/application/repositories/assignors'
import { PayablesRepository } from '@/domain/assignors-payables-management/application/repositories/payables'
import { UsersRepository } from '@/domain/assignors-payables-management/application/repositories/users'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAssignorsRepository } from './prisma/repositories/assignors'
import { PrismaPayablesRepository } from './prisma/repositories/payables'
import { PrismaUsersRepository } from './prisma/repositories/users'

@Module({
  imports: [],
  providers: [
    PrismaService,
    { provide: AssignorsRepository, useClass: PrismaAssignorsRepository },
    { provide: PayablesRepository, useClass: PrismaPayablesRepository },
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [
    PrismaService,
    AssignorsRepository,
    PayablesRepository,
    UsersRepository,
  ],
})
export class DatabaseModule {}
