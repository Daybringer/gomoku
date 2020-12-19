import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { UserInterface as User } from './models/user.interface';
@Injectable()
export class UsersRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  public async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findByUUID(uuid: string): Promise<User> {
    return this.userRepository.findOne({ UUID: uuid });
  }

  // TODO very much naive solution, has been secured with isAlphaNumeric, but should prolly change
  // ? One solution could be to do both searches and only take the valid one if one exists
  public async findByEmailOrUsername(usernameOrEmail: string): Promise<User> {
    if (usernameOrEmail.includes('@')) {
      return this.userRepository.findOne({ email: usernameOrEmail });
    } else {
      return this.userRepository.findOne({ username: usernameOrEmail });
    }
  }
}
