import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';
import { TokensService } from 'src/auth/token.service';
import { Repository } from 'typeorm';
import { LoginStrategy, UserEntity } from '../models/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tokenService: TokensService,
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
    newUser.strategy = LoginStrategy.LOCAL;
    newUser.mailVerificationCode = this.tokenService.generateRandomToken(
      12,
      false,
    );
    // newUser.createdTimestamp = String(Date.now());
    return this.userRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ username });
  }

  isVerificationTimedOut(user: UserEntity): boolean {
    const verificationTimeSpan = 1000 * 60 * 60; // 1h
    return user.createdAt.getTime() + verificationTimeSpan < Date.now();
  }

  async verifyUser(user: UserEntity) {
    user.verified = true;
    return this.userRepository.save(user);
  }

  async updatePassword(user: UserEntity, newPassword: string) {
    //FIXME not how update works
    return this.userRepository.update(user, { password: newPassword });
  }

  async removeOneByID(id: number) {
    return this.userRepository.delete({ id });
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneByID(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ id });
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
