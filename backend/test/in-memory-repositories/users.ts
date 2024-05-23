import { UsersRepository } from '@/domain/assignors-receivables-management/application/repositories/users'
import {
  User,
  UserProps,
} from '@/domain/assignors-receivables-management/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User<UserProps>[] = []

  async findByLogin(login: string): Promise<User<UserProps> | null> {
    const user = this.items.find(
      (item) => item.email === login || item.document.value === login,
    )

    if (!user) {
      return null
    }

    return user
  }
}
