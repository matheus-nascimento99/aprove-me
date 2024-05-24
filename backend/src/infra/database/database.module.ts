import { Module } from '@nestjs/common'

import { AssignorsRepository } from '@/domain/assignors-payables-management/application/repositories/assignors'
import { PayablesRepository } from '@/domain/assignors-payables-management/application/repositories/payables'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAssignorsRepository } from './prisma/repositories/assignors'
import { PrismaPayablesRepository } from './prisma/repositories/payables'

@Module({
  imports: [],
  providers: [
    PrismaService,
    { provide: AssignorsRepository, useClass: PrismaAssignorsRepository },
    { provide: PayablesRepository, useClass: PrismaPayablesRepository },
  ],
  exports: [PrismaService, AssignorsRepository, PayablesRepository],
})
export class DatabaseModule {}
