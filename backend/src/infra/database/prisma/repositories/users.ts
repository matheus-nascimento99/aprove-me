import { Injectable } from '@nestjs/common'

import { UsersRepository } from '@/domain/assignors-payables-management/application/repositories/users'
import {
  User,
  UserProps,
} from '@/domain/assignors-payables-management/enterprise/entities/user'

import { PrismaAssignorsMapper } from '../mappers/assignors'
import { PrismaService } from '../prisma.service'
@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByLogin(userLogin: string): Promise<User<UserProps> | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: userLogin,
          },
          { document: userLogin },
        ],
      },
    })

    if (!user) {
      return null
    }

    return PrismaAssignorsMapper.toDomain(user)
  }
}
