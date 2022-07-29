import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';
import { TokensService } from 'src/auth/token.service';
import { Repository } from 'typeorm';

import { UserEntity } from '../models/user.entity';
import { LoginStrategy } from '../shared/types';

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
    newUser.strategy = LoginStrategy.Local;
    newUser.mailVerificationCode = this.tokenService.generateRandomToken(
      12,
      false,
    );
    // newUser.createdTimestamp = String(Date.now());
    return this.userRepository.save(newUser);
  }

  // took me 3 hours xd
  // TODO capitalize every word
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
    const newUser = new UserEntity();
    let randName =
      this.generateRandomName() + String(Math.floor(Math.random() * 100));
    let user = await this.findOneByUsername(randName);
    while (user) {
      randName =
        this.generateRandomName() + String(Math.floor(Math.random() * 100));
      user = await this.findOneByUsername(randName);
    }
    newUser.email = email;
    newUser.username = randName;
    newUser.socialID = gID;
    newUser.strategy = LoginStrategy.Google;
    newUser.nameChangeTokens = 1;
    newUser.verified = true;
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
    user.password = newPassword;
    return this.userRepository.save(user);
  }

  async updateUsername(user: UserEntity, username: string) {
    return this.userRepository.update({ id: user.id }, { username: username });
  }

  async decrementNameTokens(user: UserEntity) {
    user.nameChangeTokens--;
    return this.userRepository.save(user);
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

  // TODO might isolate achievement logic to achievements themselves or at least separate this function to a single file
  async checkAchievements(user: UserEntity) {}
}
