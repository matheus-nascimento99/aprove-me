import { User, UserProps } from '../../enterprise/entities/user'

export abstract class UsersRepository {
  abstract findByLogin(userLogin: string): Promise<User<UserProps> | null>
}
