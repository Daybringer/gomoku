import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';
import { TokensService } from 'src/auth/token.service';
import { Repository } from 'typeorm';
import { LoginStrategy, UserEntity } from '../models/user.entity';
import { adjectives, nouns } from './randomNameDict';
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

  // took me 3 hours xd
  generateRandomName(): string {
    const randLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const chosenAdj: string =
      adjectives[randLetter][
        Math.floor(Math.random() * adjectives[randLetter].length)
      ];
    const chosenNoun: string =
      nouns[randLetter][Math.floor(Math.random() * nouns[randLetter].length)];
    const randName = chosenAdj + ' ' + chosenNoun;
    return randName;
  }

  async createGoogle(email: string, gID: string): Promise<UserEntity> {
    return;
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

  // FIXME very lazy and dangerous approach >> requires usernames without @
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
