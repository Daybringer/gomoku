import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './models/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createLocal(
    username: string,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.strategy = 'local';
    return this.userRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ username });
  }

  isVerified(user: UserEntity): boolean {
    return user.verified;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findByUUID(uuid: string): Promise<UserEntity> {
    return this.userRepository.findOne({ UUID: uuid });
  }

  async findByEmailOrUsername(usernameOrEmail: string): Promise<UserEntity> {
    if (usernameOrEmail.includes('@')) {
      return this.userRepository.findOne({
        email: usernameOrEmail.toLowerCase(),
      });
    } else {
      return this.userRepository.findOne({ username: usernameOrEmail });
    }
  }
}
