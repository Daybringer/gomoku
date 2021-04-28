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
    newUser.created = String(Date.now());
    return this.userRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ username });
  }

  isVerificationTimedOut(user: UserEntity): boolean {
    const verificationTimeSpan = 1000 * 60; // 1h
    return Number(user.created) + verificationTimeSpan < Date.now();
  }

  async verifyUser(user: UserEntity) {
    return this.userRepository.update(user, { verified: true });
  }

  async updatePassword(user: UserEntity, newPassword: string) {
    return this.userRepository.update(user, { password: newPassword });
  }

  async removeOneByUUID(UUID: string) {
    return this.userRepository.delete({ UUID });
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneByUUID(UUID: string): Promise<UserEntity> {
    return this.userRepository.findOne({ UUID });
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
